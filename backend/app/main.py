import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.models import Post, Tag, Experiment

from app.api.routes import posts, experiments, github

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include public content routers
app.include_router(posts.router, prefix=f"{settings.API_V1_STR}/posts", tags=["posts"])
app.include_router(experiments.router, prefix=f"{settings.API_V1_STR}/experiments", tags=["experiments"])
app.include_router(github.router, prefix=f"{settings.API_V1_STR}/github", tags=["github"])

@app.on_event("startup")
def on_startup():
    # Create database tables automatically
    Base.metadata.create_all(bind=engine)
    
    # Initial Data Seeding
    db = SessionLocal()
    try:
        # Seed sample posts if empty or missing devops post
        devops_slug = "i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong"
        existing = db.query(Post).filter(Post.slug == devops_slug).first()
        
        devops_content = """![DevOps Pipeline Hero Graphic](hero-banner)

# Before We Start — Why I Built This

I'm learning DevOps. And like most people learning DevOps, I was drowning in theory. I knew what Docker *was*. I could explain CI/CD in an interview. But I hadn't actually built a full pipeline from scratch.

So I decided to stop watching tutorials and just build something real.

The goal was simple — take a Flask web app, containerize it with Docker, provision cloud infrastructure with Terraform, and set up Jenkins to automatically deploy every time I push code to GitHub.

Simple in theory. Absolutely chaotic in practice.

This is the full story — every step, every error, every fix, and every "oh that's why" moment. If you're learning DevOps and want something real to build, follow along.

---

## What I Built

A simple **Task Manager web app** — you can add tasks, mark them done, delete them. Nothing fancy. The point wasn't the app. The point was the pipeline around it.

Here's what the full setup looks like:

```text
Your Laptop
    │
    │ git push
    ▼
GitHub Repo
    │
    │ webhook trigger
    ▼
Jenkins (running on AWS EC2)
    │
    ├─ Stage 1: Clone latest code
    ├─ Stage 2: Build Docker image
    ├─ Stage 3: Deploy with Docker Compose
    └─ Stage 4: Verify deployment
    │
    ▼
Flask Container (port 5000)
    │
    ▼
MySQL Container (port 3306)
    │
    ▼
Live app at http://<EC2-IP>:5000
```

Every time I push code → webhook triggers Jenkins → Jenkins builds and deploys automatically → changes are live in minutes. No manual steps.

### Tech Stack

| What | Tool |
| :--- | :--- |
| **Web App** | Python Flask |
| **Database** | MySQL 8.0 |
| **Containerization** | Docker + Docker Compose |
| **Infrastructure** | Terraform |
| **CI/CD** | Jenkins |
| **Cloud** | AWS EC2 (Mumbai region) |
| **Version Control** | GitHub |

Let's build it step by step.

---

## Phase 1 — The Flask App

First things first — I needed an actual app to deploy. I built a simple Task Manager with Flask and MySQL.

The app has 5 routes:

```python
@app.route("/")             # show all tasks
@app.route("/add")          # add a new task
@app.route("/toggle/<id>")  # mark done/undone
@app.route("/delete/<id>")  # delete a task
@app.route("/health")       # health check for Docker
```

That `/health` route matters — Docker uses it to know when the container is actually ready to accept connections. More on that later.

One thing I was careful about — Flask connects to MySQL using **environment variables**, not hardcoded credentials:

```python
def get_db_connection():
    conn = mysql.connector.connect(
        host=os.environ.get("MYSQL_HOST", "localhost"),
        user=os.environ.get("MYSQL_USER", "root"),
        password=os.environ.get("MYSQL_PASSWORD", "root"),
        database=os.environ.get("MYSQL_DB", "devops")
    )
    return conn
```

These values get passed in by Docker Compose later. This is the right way to handle config — keep it out of your code.

The app also auto-creates the database table on startup:

```python
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(\"\"\"
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            done BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    \"\"\")
    conn.commit()
```

No manual SQL setup needed. The table just appears on first run.

---

## Phase 2 — Dockerizing the App

### Writing the Dockerfile
The Dockerfile defines how to build the Flask app into a Docker image:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

Let me explain what each part actually does, because I spent time understanding this:
- `python:3.9-slim` — lightweight Python base image. The full Python image is 900MB+. Slim is ~130MB. Smaller image = faster builds and pulls.
- `gcc` and `default-libmysqlclient-dev` — the `mysql-connector-python` package needs these to compile. Without them, `pip install` fails with a cryptic error.
- `COPY requirements.txt .` before `COPY . .` — this is intentional. Docker caches each layer. If you copy `requirements.txt` first and install dependencies, Docker only reinstalls packages when `requirements.txt` actually changes — not every time you change your app code. Saves minutes on every build.

### Writing Docker Compose
One container for Flask, one for MySQL. Docker Compose manages both:

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: "devops"
      MYSQL_ROOT_PASSWORD: "root"
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - two-tier
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 60s

  flask:
    build:
      context: .
    ports:
      - "5000:5000"
    environment:
      - MYSQL_HOST=mysql
      - MYSQL_USER=root
      - MYSQL_PASSWORD=root
      - MYSQL_DB=devops
    networks:
      - two-tier
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql-data:

networks:
  two-tier:
```

Three things here that actually matter:
1. **Docker networking** — notice `MYSQL_HOST=mysql`. Flask connects to MySQL using the container name `mysql` — not `localhost`. This is how Docker networking works. Containers on the same network can reach each other by their service name. This confused me initially until it clicked.
2. **Healthcheck + depends_on** — `depends_on: condition: service_healthy` means Flask only starts after MySQL passes its healthcheck. Without this, Flask starts while MySQL is still initializing, can't connect, and crashes. The healthcheck pings MySQL every 10 seconds. Only when it gets a successful response does Flask start.
3. **Named volume** — `mysql-data:/var/lib/mysql` stores MySQL data in a named volume, not inside the container. This means your data survives container restarts and even redeployments. Without this, every `docker compose down` would wipe all your data.

### First Problem — Port 3306 Already in Use
I ran `docker compose up -d --build` and got this:

```text
Error response from daemon: ports are not available: exposing port 0.0.0.0:3306 -> 127.0.0.1:0: listen tcp 0.0.0.0:3306: bind: address already in use
```

My Mac had MySQL installed locally and already using port 3306.

**Fix**: Changed the port mapping in `docker-compose.yml` from `3306:3306` to `3307:3306`. This means my Mac uses port 3307 externally, but inside Docker's network containers still communicate on 3306. Flask was unaffected because Flask talks to MySQL *inside* the Docker network, not through the host port.

```bash
docker compose down
docker compose up -d --build
docker ps
```

```text
CONTAINER ID   IMAGE                 COMMAND                  CREATED        STATUS                    PORTS                                       NAMES
0b3f03244c40   flask-todo-app-flask  "python app.py"          17 hours ago   Up 17 hours               0.0.0.0:5000->5000/tcp, [::]:5000->5000/tcp  flask-app
8d72a49c1ce7   mysql:8.0             "docker-entrypoint.s…"   17 hours ago   Up 17 hours (healthy)    0.0.0.0:3307->3306/tcp, [::]:3307->3306/tcp  mysql
```

### Verifying MySQL Actually Works
This is something I'd recommend everyone do — don't just trust the UI. Connect directly to MySQL and verify:

```bash
docker exec -it mysql mysql -uroot -proot devops
```

```sql
SHOW TABLES;
SELECT * FROM tasks;
```

I could see my tasks in the database. `done = 1` for completed tasks, `done = 0` for pending. The auto-increment IDs had gaps (1, 2, 4) because I'd deleted task 3 — completely normal MySQL behaviour.

Phase 1 done. Flask app + MySQL running locally in Docker, data persisting correctly.

---

## Phase 3 — AWS Infrastructure with Terraform
Now I needed to get this running on AWS. But instead of clicking through the AWS console, I used Terraform to define the infrastructure as code.

### What is Terraform and Why Use It?
Terraform is a tool that lets you describe your cloud infrastructure in code files. Instead of manually clicking through 10 screens in AWS console to create an EC2 instance, you write a `.tf` file and run one command. Terraform makes the API calls to AWS and creates everything.

The benefit is repeatability. If I need to recreate my infrastructure, I just run `terraform apply` again. If someone else wants to run this project, they run the same command and get identical infrastructure. No more "it worked on my account" problems.

### Step 1 — Create IAM User
First rule of AWS — never use root credentials for programmatic access. I created a dedicated IAM user:
1. AWS Console → IAM → Users → Create User
2. Username: `terraform-user`
3. Attach policy: `AdministratorAccess`
4. Security credentials tab → Create access key → CLI use case
5. Download the CSV — **you only see the secret key once**

### Step 2 — Configure AWS CLI
```bash
brew install awscli
aws configure
```

Entered the access key, secret key, region (`ap-south-1` — Mumbai, closest to me in India), and output format (`json`).

Verified it worked:
```bash
aws sts get-caller-identity
```

```json
{
    "UserId": "AIDAVYL6B7OWOE46SJFVF",
    "Account": "395938234560",
    "Arn": "arn:aws:iam::395938234560:user/terraform-user"
}
```

This command asks AWS "who am I?" — if it returns your account details, credentials are configured correctly. If Terraform can run this command, it can create resources in your account.

### Step 3 — The Three Terraform Files
`variables.tf` — stores values that might change:

```hcl
variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Your EC2 key pair name"
}
```

`key_name` has no default — Terraform will ask for it every time you run apply. This is intentional because key pair names are personal to each AWS account.

`main.tf` — the actual AWS resources:

```hcl
provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "flask_sg" {
  name        = "flask-jenkins-sg"
  description = "Allow SSH, Jenkins, and Flask"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Flask App"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "flask_server" {
  ami                    = "ami-0f58b397bc5c1f2e8"
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.flask_sg.id]
  subnet_id              = tolist(data.aws_subnets.default.ids)[0]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
  }

  tags = {
    Name = "flask-jenkins-server"
  }
}
```

The security group is basically a firewall. Port 22 for SSH, 8080 for Jenkins, 5000 for Flask. Without opening these ports, nothing is reachable from outside the EC2.

`outputs.tf` — prints useful info after apply:

```hcl
output "ec2_public_ip" {
  value = aws_instance.flask_server.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.flask_server.public_ip}"
}
```

This prints your EC2 IP and exact SSH command after Terraform finishes. I love this — no need to go back to AWS console to find the IP.

### Step 4 — Create Key Pair
In AWS Console → EC2 → Key Pairs → Create:
- Name: `flask-key`
- Type: RSA, Format: `.pem`
- Download it

Then on my Mac:
```bash
mv ~/Downloads/flask-key.pem ~/.ssh/
chmod 400 ~/.ssh/flask-key.pem
```

`chmod 400` makes the key readable only by you. SSH refuses to use keys with loose permissions — you'll get "WARNING: UNPROTECTED PRIVATE KEY FILE" and the connection gets rejected.

### Step 5 — Terraform Init, Plan, Apply
```bash
cd terraform
terraform init
```

This downloads the AWS provider plugin. You'll see a `.terraform` folder appear. The `.terraform.lock.hcl` file locks the exact provider version — same idea as `requirements.txt` for Python.

```bash
terraform plan
```

This is a dry run. Terraform shows exactly what it will create without actually doing anything. I always run this before apply — no surprises.

```bash
terraform apply
```

Type `flask-key` for the key name, then `yes` to confirm.

### Debugging — No Default Subnets
First error I hit:
```text
Error: creating EC2 Instance: No subnets found for the default VPC
```

My AWS account had a default VPC but no default subnets inside it. Terraform couldn't place the EC2 anywhere.

**Fix**:
```bash
aws ec2 create-default-subnet --availability-zone ap-south-1a
```

Re-ran `terraform apply` and it worked.

### Debugging — No Public IP
Apply succeeded but:
```text
ec2_public_ip = ""
```

The EC2 was created without a public IP, so I couldn't reach it from the internet.

**Fix**: Added one line to the `aws_instance` block in `main.tf`:
```hcl
associate_public_ip_address = true
```

Ran `terraform apply` again. This time Terraform destroyed the old EC2 and created a new one — because public IP association can't be changed on a running instance. That's fine. That's Terraform doing the right thing.

This time:
```text
ec2_public_ip = "43.205.146.206"
ssh_command = "ssh -i ~/.ssh/flask-key.pem ubuntu@43.205.146.206"
```

---

## Phase 4 — Setting Up the EC2 Server
SSH into the freshly created EC2:
```bash
ssh -i ~/.ssh/flask-key.pem ubuntu@43.205.146.206
```

### Installing Docker
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
```

`systemctl enable` ensures Docker starts automatically on reboot. `usermod -aG docker ubuntu` adds ubuntu user to the docker group — otherwise every `docker` command needs `sudo`.

### Installing Jenkins
Jenkins needs Java first:
```bash
sudo apt install openjdk-17-jdk -y
```

Then add the Jenkins repository and install:
```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/jenkins.gpg > /dev/null
echo "deb [signed-by=/etc/apt/trusted.gpg.d/jenkins.gpg] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update --allow-insecure-repositories
sudo apt install jenkins -y --allow-unauthenticated
```

*Honest note: The GPG key verification failed multiple times with various errors. I tried 4 different methods. Eventually I used `--allow-unauthenticated` to bypass it. For a production server I'd fix this properly — for a learning project on a temporary EC2, getting Jenkins installed was more important.*

Give Jenkins Docker permissions — critical step:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

If you skip this, Jenkins will fail every build with "permission denied" when it tries to run `docker build`.

### Adding Swap Memory — Important
`t2.micro` has 1GB RAM. Jenkins alone uses ~300MB. MySQL needs ~400MB. Flask needs ~100MB. That's already over 800MB on a 1GB machine.

The first time I ran the Jenkins pipeline, the EC2 completely froze. Couldn't SSH in, couldn't open Jenkins, nothing. The system ran out of memory and died.

The fix — swap space:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

```text
               total        used        free
Mem:           954Mi       887Mi        72Mi
Swap:          1.4Gi       93Mi        1.3Gi
```

Swap is disk space used as overflow RAM. Slower than real RAM but prevents the system from freezing when memory gets tight. Adding it to `/etc/fstab` makes it survive reboots.

### Jenkins Initial Setup
Get the initial admin password:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Open `http://<EC2-IP>:8080` in browser, paste the password, click "Install suggested plugins", create an admin user.

---

## Phase 5 — The Jenkins CI/CD Pipeline

### The Jenkinsfile
This file lives in your repository and defines the pipeline. Jenkins reads it from GitHub on every build:

```groovy
pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/shlokbam/flask-todo-app'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t flask-todo-app:latest .'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d --build'
            }
        }

        stage('Deployment Status') {
            steps {
                sh 'docker ps'
                echo 'Deployment successful! App running on port 5000'
            }
        }
    }
}
```

4 stages, clean and simple:
1. **Clone Code** — Jenkins pulls your latest GitHub code onto the EC2
2. **Build Docker Image** — builds a fresh Flask image from your Dockerfile
3. **Deploy with Docker Compose** — stops old containers, starts new ones
4. **Deployment Status** — runs `docker ps` to confirm everything is running, then prints success

The `|| true` on `docker compose down` means "if no containers are running, don't fail" — handles the first run where there's nothing to stop.

### Creating the Pipeline in Jenkins
1. Dashboard → New Item → Pipeline → name it `flask-todo-pipeline`
2. Scroll to Pipeline section
3. Definition: **Pipeline script from SCM**
4. SCM: **Git**
5. Repository URL: your GitHub repo URL
6. Branch: `*/main`
7. Script Path: `Jenkinsfile`
8. Save

### The Build That Took 51 Minutes to Fail
I clicked Build Now. Stage 1, 2, 3 went green. Stage 3 "Deploy with Docker Compose" started...

And kept going. 10 minutes. 20 minutes. 40 minutes. 51 minutes. Still running.

The EC2 froze again. Jenkins UI stopped responding.

This time it wasn't memory — it was **disk space**.

```text
Usage of /: 99.8% of 6.71GB
```

The default EC2 root volume is 8GB. Docker had downloaded the MySQL image (~600MB), the Python image, build cache, Jenkins files — and the disk was completely full. Docker couldn't finish pulling images. Jenkins couldn't write logs. Everything froze.

**Fix — free up disk first**:
```bash
docker system prune -af
sudo rm -rf /var/lib/jenkins/workspace/flask-todo-pipeline
```

`docker system prune -af` removes all unused images, containers, and build cache. Freed 629MB instantly.

**Fix — upgrade the disk via Terraform**:
Added this to `main.tf`:
```hcl
root_block_device {
  volume_size = 20
}
```

Ran `terraform apply`. Terraform expanded the volume to 20GB without destroying the EC2 — just modified the block device in place.

But AWS expanding the volume doesn't automatically tell the OS to use it. I had to do that manually:
```bash
sudo growpart /dev/xvda 1
sudo resize2fs /dev/root
df -h
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        19G  6.2G   13G  34% /
```

From 0% free to 13GB free. That's more like it.

### Finally — All Green
Clicked Build Now again. This time with 13GB disk free and swap active:

```text
✅ Clone Code              - 0.87s
✅ Build Docker Image      - 5m 12s
✅ Deploy with Compose     - 5m 48s
✅ Deployment Status       - 25s
```

The Deploy stage took 5 minutes because it was downloading the MySQL image for the first time. Every build after that is much faster — the image is cached.

---

## Phase 6 — The MySQL Connection Error
I opened `http://<EC2-IP>:5000` expecting to see my app.

Connection refused.

Checked the containers:
```bash
docker ps
```

```text
flask-app   Restarting (1) 47 seconds ago
mysql       Up 4 minutes (healthy)
```

MySQL was healthy. Flask was crashing and restarting in a loop.

Checked Flask logs:
```bash
docker logs flask-app
```

```text
mysql.connector.errors.DatabaseError: 1130 (HY000): Host '172.18.0.3' is not allowed to connect to this MySQL server
```

This one took me a while to understand.

MySQL 8.0 by default only allows the root user to connect from `localhost`. But Flask is running in a separate container with IP `172.18.0.3`. From MySQL's perspective, that's a remote host — and root isn't allowed from remote hosts.

**Fix**:
```bash
docker exec -it mysql mysql -uroot -proot -e \
  "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root';"
```

`'root'@'%'` means "allow root user to connect from any host". The `%` is a wildcard.

Then:
```bash
docker compose down
docker compose up -d --build
docker ps
```

Both containers running healthy. Opened `http://<EC2-IP>:5000`.

It worked. The app was live on AWS.

---

## Phase 7 — GitHub Webhook Automation
The pipeline works. But right now I have to click "Build Now" manually every time I push code. That defeats the purpose of CI/CD.

Webhooks fix this.

### What is a Webhook?
A webhook is basically GitHub saying "hey Jenkins, someone just pushed code" — it sends an HTTP POST request to Jenkins every time a push happens. Jenkins receives it and automatically starts the pipeline.

### Setting It Up
In GitHub:
1. Repository → Settings → Webhooks → Add webhook
2. Payload URL: `http://<EC2-IP>:8080/github-webhook/`
3. Content type: `application/json`
4. Events: "Just the push event"
5. Save

In Jenkins:
1. Pipeline → Configure
2. Build Triggers → check **"GitHub hook trigger for GITScm polling"**
3. Save

### Testing It
Made a small change — updated the footer text in `index.html`:
```html
<!-- changed from -->
<footer>Deployed via Jenkins CI/CD Pipeline on AWS EC2</footer>

<!-- changed to -->
<footer>Auto-deployed via Jenkins CI/CD | Flask + Docker + AWS</footer>
```

Committed and pushed:
```bash
git add .
git commit -m "update footer text"
git push origin main
```

Within seconds, Jenkins dashboard showed a new build starting automatically. No clicking. The pipeline ran all 4 stages and deployed. Refreshed the website — footer was updated.

That moment — seeing your code go from your laptop to a live server automatically — is genuinely satisfying. That's CI/CD working exactly as intended.

---

## Everything That Went Wrong — Summary

Here's every problem I hit and how I fixed it, for quick reference:

| Problem | Cause | Fix |
| :--- | :--- | :--- |
| **Port 3306 already in use** | Local MySQL using the port | Changed to `3307:3306` in `docker-compose.yml` |
| **No subnets found** | New AWS account without default subnets | `aws ec2 create-default-subnet --availability-zone ap-south-1a` |
| **No public IP on EC2** | Missing `associate_public_ip_address = true` in Terraform | Added the line, re-applied |
| **EC2 froze completely** | t2.micro ran out of 1GB RAM | Added 2GB swap space |
| **Jenkins GPG key error** | Key format incompatible with Ubuntu 24.04 | Used `--allow-unauthenticated` flag |
| **Jenkins startup timeout** | Default 90s timeout too short for t2.micro | Increased to 300s via systemd override |
| **Disk full, pipeline stuck** | 8GB default volume filled by Docker images | Upgraded to 20GB via Terraform, expanded filesystem |
| **Flask can't connect to MySQL** | MySQL 8.0 restricts root to localhost | `GRANT ALL PRIVILEGES TO 'root'@'%'` |

Every single one of these errors taught me something. The disk space issue taught me about Docker layer caching. The MySQL permissions error taught me about MySQL's default security model. The RAM issue taught me about swap memory.

You learn more from things breaking than from things working.

---

## What I'd Do Differently
1. **Use t2.medium instead of t2.micro** — t2.micro with 1GB RAM is genuinely painful for running Jenkins + Docker + MySQL. It works, but with swap memory and timeouts. 2GB RAM makes everything smoother.
2. **Use environment variables for secrets** — The MySQL password is hardcoded as "root" in `docker-compose.yml`. In a real project I'd use AWS Secrets Manager or at minimum a `.env` file that's never committed to GitHub.
3. **Add a `terraform.tfvars` file** — Instead of typing `flask-key` every time Terraform asks, I'd store it in a `terraform.tfvars` file: `key_name = "flask-key"`.
4. **Use `user_data` in Terraform** — Terraform's `user_data` lets you run a shell script when EC2 first starts — so Docker and Jenkins get installed automatically as part of `terraform apply`. No manual SSH setup needed.

---

## Key Takeaways
- **Docker networking** — containers communicate by service name, not `localhost`. This is one of those things that sounds obvious in theory and confuses everyone in practice.
- **Infrastructure as Code** — once you understand Terraform, you'll never want to click through AWS console again. The ability to `terraform destroy` and `terraform apply` and get back exactly what you had is genuinely powerful.
- **CI/CD is just automation** — it sounds complex but it's literally: code change → trigger → build → deploy. The magic is that each step is reliable and repeatable.
- **Real projects break** — every tutorial shows you the happy path. Real projects hit disk limits, memory constraints, GPG key incompatibilities, and MySQL permission errors. Debugging these is the actual job.

---

## Resources
- GitHub repo: `github.com/shlokbam/flask-todo-app`
- Terraform AWS provider docs
- Jenkins Pipeline syntax
- Docker Compose reference
"""

        if not existing:
            devops_post = Post(
                title="I Built a Full DevOps CI/CD Pipeline from Scratch — Here's Everything That Went Wrong",
                slug=devops_slug,
                excerpt="A honest, detailed walkthrough of building a Flask + Docker + Jenkins + Terraform + AWS project — including every error, every fix, and every 'why is this not working' moment.",
                content=devops_content,
                content_type="BUILD",
                category="DevOps",
                reading_time="20 min read",
                status="PUBLISHED",
                featured=True,
                published_at="2026-03-14",
                github_repo="shlokbam/flask-todo-app"
            )
            db.add(devops_post)

            # Assign tags
            for t_name in ["DevOps", "Docker", "Jenkins", "Terraform", "AWS", "Flask", "MySQL"]:
                tag = db.query(Tag).filter(Tag.name == t_name).first()
                if not tag:
                    tag = Tag(name=t_name, slug=t_name.lower().replace(" ", "-"))
                    db.add(tag)
        else:
            existing.content = devops_content
            existing.reading_time = "20 min read"
            existing.published_at = "2026-03-14"

        # Seed Article 2: DataLens
        datalens_slug = "i-built-an-ai-data-analyst-app-from-scratch-here-s-how-i-taught-a-flask-app-to-think"
        datalens_content = """![DataLens AI Data Analyst Banner](datalens-hero)

# Before We Start — Why I Built This

I've been getting into AI APIs lately. And like most people who just discovered that you can call a language model from Python in three lines of code, I immediately wanted to do something actually useful with it.

The idea came from a real frustration. I had a sales CSV with 2,800 rows. I wanted to know which region was performing best, what the trend looked like over time, and whether there was a correlation between deal size and product line. I opened Excel, filtered, aggregated, made a pivot table, screamed internally, and gave up.

What if I could just *ask* those questions in plain English and get an actual answer?

So I built DataLens — an app where you upload any CSV, ask questions in natural language, get AI-powered insights, and get automatically generated charts. Then I kept going. Added user accounts. Saved conversation history. Added PDF export.

This post covers the full build — every phase, every concept, every error that made me question my choices. If you're learning Flask, SQLAlchemy, or working with AI APIs, there's something here for you.

---

## What I Built

Here's what DataLens does:

![DataLens Architecture Flow](datalens-flow)

```text
User uploads CSV
    │
    ▼
Flask reads the file ➔ Pandas generates a text summary
    │
    ▼
Groq API (Llama 3.3 70B) reads summary ➔ generates insight
    │
    ▼
Groq suggests chart type + which columns to plot
    │
    ▼
Matplotlib renders the chart ➔ PNG sent directly to browser
    │
    ▼
SQLAlchemy saves the Q&A to database
    │
    ▼
User can switch between past chats, export PDFs
```

Every question you ask is saved. Every analysis session is stored. You can close the tab, come back tomorrow, and pick up exactly where you left off. And when you're done, you can export the whole conversation — questions, AI answers, and charts — as a PDF.

### Tech Stack

| What | Tool |
| :--- | :--- |
| **Web Framework** | Python Flask |
| **Database** | SQLAlchemy + SQLite |
| **Auth** | Flask-Login |
| **AI** | Groq API (Llama 3.3 70B) |
| **Data Processing** | Pandas |
| **Charting** | Matplotlib |
| **PDF Generation** | ReportLab |
| **Frontend** | Vanilla JS + CSS |

I built this in 4 phases. Let me walk you through each one.

---

## Phase A — SQLAlchemy + Database Design

The first decision was the data model. Three tables:

- **User** — email and hashed password
- **Chat** — each CSV upload creates a Chat (stores filename and path)
- **Message** — each Q&A exchange is a Message inside a Chat

This is a classic one-to-many relationship:
- One User ➔ many Chats
- One Chat ➔ many Messages

Here's how that looks in SQLAlchemy:

```python
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    chats         = db.relationship('Chat', backref='user', lazy=True, cascade='all, delete-orphan')

class Chat(db.Model):
    __tablename__ = 'chats'
    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(200), nullable=False)
    csv_path     = db.Column(db.String(500))
    csv_filename = db.Column(db.String(200))
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'))
    messages     = db.relationship('Message', backref='chat', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    __tablename__ = 'messages'
    id          = db.Column(db.Integer, primary_key=True)
    chat_id     = db.Column(db.Integer, db.ForeignKey('chats.id'))
    question    = db.Column(db.Text, nullable=False)
    answer      = db.Column(db.Text, nullable=False)
    chart_type  = db.Column(db.String(50))
    chart_x_col = db.Column(db.String(200))
    chart_y_col = db.Column(db.String(200))
```

A few things here that are worth understanding:

- `cascade='all, delete-orphan'` — when you delete a User, all their Chats get deleted automatically. When you delete a Chat, all its Messages go too. Without this, you'd have orphaned rows sitting in the database forever.
- `backref='user'` — this creates a reverse relationship. Once this is set, you can do `chat.user` to get the User who owns that chat, without writing any extra query. SQLAlchemy handles it.
- `UserMixin` — Flask-Login needs certain methods on your User model (`is_authenticated`, `get_id()`, etc.). `UserMixin` provides all of these for free. You just inherit from it.

No separate migration tool needed for this project. Just `db.create_all()` inside the app context on startup, and all three tables get created automatically.

---

## Phase B — Flask Blueprints + Auth

This is where I learned what Blueprints actually are, not just theoretically.

A Blueprint is Flask's way of splitting a large app into smaller, reusable pieces. Instead of dumping everything in `app.py`, you put auth-related routes in `auth.py` as a Blueprint and register it in `app.py`. The routes behave identically — they're just organized.

```python
# auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
        
    if request.method == 'POST':
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            flash('Invalid email or password.', 'error')
            return render_template('login.html')
            
        login_user(user, remember=True)
        return redirect(url_for('index'))
        
    return render_template('login.html')
```

```python
# app.py
from auth import auth_bp
app.register_blueprint(auth_bp)
```

That's it. The route lives at `/login` and you reference it anywhere as `url_for('auth.login')`. The `auth.` prefix is the Blueprint name. One of those things where once you see it, it clicks immediately.

### Password Hashing Error & Fix

I ran into a compatibility issue here. Werkzeug 2.x defaults to `scrypt` for hashing. But `scrypt` requires OpenSSL compiled with scrypt support, and my Python 3.9 environment didn't have it:

```text
AttributeError: module 'hashlib' has no attribute 'scrypt'
```

Fix was simple — explicitly specify `pbkdf2:sha256`:

```python
def set_password(self, password):
    self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')
```

`pbkdf2:sha256` is NIST-approved, used by production apps everywhere, and works on all Python versions. Perfectly fine security-wise.

### Protecting Routes

One decorator and a route is fully protected:

```python
@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    ...
```

Unauthenticated requests get redirected to the login page automatically. Just make sure you tell Flask-Login where your login page is:

```python
login_manager.login_view = 'auth.login'
```

---

## Phase C — Multi-Chat Routing

Here's where it got interesting.

The original version of the app was stateless — you uploaded a file, asked questions, everything lived in the Flask session (basically a browser cookie). Close the tab and it was gone. Not great.

Phase C converts it to full persistence. Every upload creates a Chat row. Every question creates a Message row. The user's sidebar shows all their past analyses.

```python
@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Phase C: create a Chat record in the database
    chat = Chat(
        name=filename.replace('.csv', '').replace('_', ' ').title(),
        csv_path=filepath,
        csv_filename=filename,
        user_id=current_user.id
    )
    db.session.add(chat)
    db.session.commit()

    session['filepath'] = filepath
    session['chat_id'] = chat.id
    return jsonify({"status": "success"})
```

And in the `/ask` route, after getting the AI response:

```python
msg = Message(
    chat_id     = session.get('chat_id'),
    question    = user_question,
    answer      = insight,
    chart_type  = chart_type,
    chart_x_col = chart_column_suggestion.get('x'),
    chart_y_col = chart_column_suggestion.get('y'),
)
db.session.add(msg)
db.session.commit()
```

We save the chart metadata too — not the image bytes, because charts can be regenerated from the original CSV later. This matters a lot for the PDF export in Phase D.

The chat-switching API has three routes:
- `GET /chats` — list all chats for current user
- `GET /chats/<id>` — get all messages for one chat
- `POST /chats/<id>/activate` — restore a chat into the session
- `DELETE /chats/<id>` — delete chat + cascade messages

### Legacy API Warning Fix

One thing I discovered: `db.session.get(User, user_id)` is the correct way to look up by primary key in SQLAlchemy 2.x. The old `User.query.get(id)` syntax still works but fires a deprecation warning on every request:

```text
LegacyAPIWarning: The Query.get() method is considered legacy
```

Changed it in the Flask-Login user loader and the warnings went away.

---

## Phase D — PDF Export with ReportLab

This was the most satisfying phase to build.

ReportLab is a Python library that gives you full programmatic control over PDF layout. No templates, no HTML-to-PDF conversion — you build every element from scratch in Python code.

The mental model is simple: ReportLab has a `story` — a list of `Flowable` objects that get laid out onto pages in order. You build the list, call `doc.build(story)`, and the library handles page breaks, margins, and layout.

```python
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    Image, HRFlowable, PageBreak
)

buf = io.BytesIO()

doc = SimpleDocTemplate(buf, pagesize=A4,
                        leftMargin=25*mm, rightMargin=25*mm,
                        topMargin=20*mm, bottomMargin=20*mm)

story = []

# Title page
story.append(Spacer(1, 30*mm))
story.append(Paragraph('DataLens', title_style))
story.append(Paragraph(chat.name, subtitle_style))
story.append(HRFlowable(width='100%', thickness=1, color=accent_color))
story.append(PageBreak())

# Q&A sections
for msg in messages:
    story.append(Paragraph(msg.question, question_style))
    story.append(Paragraph(msg.answer, answer_style))

    if msg.chart_type != 'none':
        chart_buf = regenerate_chart(msg)
        story.append(Image(chart_buf, ...))

doc.build(story)
buf.seek(0)
return buf
```

The charts are re-generated on-the-fly — I pass a `chart_generator` closure into `build_pdf()` that reads the original CSV and rerenders the chart as a PNG. This is clean because no image bytes are stored in the database.

The export route itself is simple:

```python
@app.route('/export/<int:chat_id>')
@login_required
def export_pdf(chat_id):
    chat = Chat.query.filter_by(id=chat_id, user_id=current_user.id).first_or_404()
    pdf_buf = build_pdf(chat, list(chat.messages), chart_generator)
    
    return send_file(pdf_buf,
                     mimetype='application/pdf',
                     as_attachment=True,
                     download_name=f'datalens_{chat.name.lower().replace(" ", "_")}.pdf')
```

`as_attachment=True` adds `Content-Disposition: attachment` to the response — that's the HTTP header that tells the browser to download the file instead of trying to display it inline.

---

## The AI Part — How It Actually Works

Most of the "magic" is in `gemini_helper.py` (badly named — it actually uses the Groq API, not Google Gemini, but I kept the filename to avoid breaking imports).

The key insight: I **never send the full CSV to the AI**. Sending 2,800 rows to a language model would blow past the context limit, cost tokens, and be slow. Instead, I pre-process the CSV into a compact text summary:

```text
Shape: 2823 rows × 25 columns

Column Types:
  Numeric: QUANTITYORDERED, PRICEEACH, SALES, MSRP
  Categorical: STATUS, PRODUCTLINE, COUNTRY, TERRITORY

Statistics (numeric columns):
  SALES: mean=3553.89, std=1841.87, min=482.13, max=14082.80

Top Values:
  PRODUCTLINE: Classic Cars (967), Vintage Cars (607), Motorcycles (331)
  COUNTRY: USA (1004), Spain (342), France (314)

Missing Values: None

Sample Rows:
ORDERNUMBER  SALES  PRODUCTLINE  COUNTRY
10107        2871   Motorcycles  USA
...
```

This summary — not the raw CSV — gets sent to the AI. It's maybe 800 tokens vs. tens of thousands. The model can answer most analytical questions accurately from this structured summary.

Three separate AI calls happen for each question:

1. `get_ai_insight()` — the main call. Gets the text answer. Includes the last 5 exchanges as context so follow-up questions work properly.
2. `suggest_chart_type()` — a separate call with `temperature=0` (deterministic). Returns exactly one word: `bar`, `line`, `scatter`, `histogram`, `pie`, or `none`. Low temperature because I need a parseable response, not creativity.
3. `suggest_chart_columns()` — another separate call. Returns JSON with `x` and `y` column names. I parse this, validate against the actual column list, and fall back to sensible defaults if the AI hallucinates a column name that doesn't exist.

Why three calls instead of one? When I tried to get everything in one call, the AI would sometimes get distracted and return malformed JSON, or mix the chart suggestion into the text answer. Separating concerns made each call simpler and more reliable.

---

## Everything That Went Wrong — Summary

| Problem | Cause | Fix |
| :--- | :--- | :--- |
| **`hashlib has no attribute 'scrypt'`** | Python 3.9 missing scrypt support | Explicitly use `method='pbkdf2:sha256'` in `generate_password_hash` |
| **Upload returning 500** | CSV with non-UTF-8 characters | `try: pd.read_csv(f) except UnicodeDecodeError: pd.read_csv(f, encoding='latin1')` |
| **Data preview table blank** | Pandas `NaN` serializes as bare `NaN` — invalid JSON | `df.where(pd.notnull(df), None)` before `to_dict()` |
| **`LegacyAPIWarning` on every request** | `User.query.get()` deprecated in SQLAlchemy 2.x | Replace with `db.session.get(User, user_id)` |
| **Auth routes returning 404** | Thought Blueprint was at `/auth/login` | Routes are at `/login` — no prefix. `url_for('auth.login')` still works |
| **Chart generator silent failure in PDF** | CSV no longer on disk when exporting old chat | Added early check `if not os.path.exists(chat.csv_path)` before rendering |

The `NaN` one cost me the most time. The symptom was completely confusing — server returned 200, JavaScript got a response, but the table was blank. Silent failure. Turned out `response.json()` was throwing a parse error because `NaN` is not valid JSON (it's `null` in JSON), and the whole preview section was quietly dying in a catch block. Classic.

---

## What I'd Do Differently

1. **Proper file storage** — Right now CSVs are saved to a local `uploads/` folder. If the server restarts, old chat sessions can't reload their charts because the files are gone. In production I'd use S3 — store the CSV path as an S3 key, not a local filesystem path.
2. **Background jobs for AI calls** — Right now the `/ask` endpoint blocks until the AI responds — usually 3–8 seconds. A better pattern is to return a job ID immediately, process the AI call in a background worker (Celery, or even a simple thread), and have the frontend poll or use WebSockets for the result. Feels much faster.
3. **Streaming AI responses** — The Groq API supports streaming responses — you can start sending tokens to the frontend as they arrive, exactly like ChatGPT does. The current setup waits for the full response before returning. Streaming would feel dramatically faster even if total time is the same.
4. **PDF charts as stored images** — Right now the PDF export re-generates charts from the original CSV. If the CSV is gone, charts are skipped silently. Better to store the chart image in S3 alongside the CSV, and reference it directly in the PDF.

---

## Key Takeaways

- **Send summaries to AI, not raw data.** Structured text summaries are more token-efficient, equally informative for analysis, and let you control exactly what context the model has. This is the pattern most production data AI tools use.
- **Separate your AI calls.** One call for the text answer, a separate call for chart type, another for column selection. Each prompt is simpler, outputs are more parseable, and failures are isolated.
- **SQLAlchemy's cascades are powerful.** `cascade='all, delete-orphan'` One time and your entire data hierarchy cleans up automatically. No manual delete queries across tables.
- **Flask Blueprints are just an organisation.** They're not especially complex — they're a way to split a growing `app.py` list into logical groups. Start using them before your app file gets too big, not after.
- **`NaN` is not `null`**. In JSON, missing values are `null`. Python's `float('nan')` serializes to bare `NaN` which browsers can't parse. Always sanitize DataFrames before JSONifying them.

---

## Resources

- GitHub repo: `github.com/shlokbam/ai-data-analyst`
- Groq API docs
- Flask-Login documentation
- SQLAlchemy ORM tutorial
- ReportLab user guide
"""
        existing_datalens = db.query(Post).filter(Post.slug == datalens_slug).first()
        if not existing_datalens:
            datalens_post = Post(
                title="I Built an AI Data Analyst App from Scratch — Here's How I Taught a Flask App to Think",
                slug=datalens_slug,
                excerpt="A full walkthrough of building DataLens — CSV uploads, Groq/Llama 3.3 70B AI insights, auto-generated charts, user auth, persistent chat history, and PDF export.",
                content=datalens_content,
                content_type="BUILD",
                category="AI",
                reading_time="13 min read",
                status="PUBLISHED",
                featured=True,
                published_at="2026-03-25",
                github_repo="shlokbam/ai-data-analyst"
            )
            db.add(datalens_post)
        else:
            existing_datalens.content = datalens_content
            existing_datalens.reading_time = "13 min read"
            existing_datalens.published_at = "2026-03-25"

        # Seed Article 3: MockVue
        mockvue_slug = "i-built-an-ai-powered-mock-interview-platform-from-scratch-here-s-everything-that-went-wrong"
        mockvue_content = """![MockVue AI Powered Mock Interview Banner](mockvue-hero)

# Before We Start — Why I Built This

I was preparing for campus placements. And I kept reading about companies like JPMorgan, Goldman Sachs, and TCS using AI-powered video assessment platforms for first-round interviews. You record yourself answering questions. An AI grades you. You never even speak to a human until the second round.

The problem? There was no good way to practice for this format. Mock interview tools either had fake questions, no video component, or gave you generic feedback like "speak more clearly." None of them actually simulated what these AI platforms do.

So I stopped looking for one and built it.

MockVue is a full-stack AI mock interview platform. You pick a company and role, answer 5 video questions under timed conditions, and get an AI-generated score across three dimensions: answer quality, speaking confidence, and eye contact. The feedback is detailed, the questions are company-specific, and the experience is close to what the actual platforms feel like.

This is the full story of building it — the architecture, every technical decision, every bug, and every "oh that's why" moment.

---

## What I Built

![MockVue End-to-End Architecture](mockvue-architecture)

A user picks a company (Google, JPMorgan, TCS, etc.) and a role. They get 5 questions. For each question: 30 seconds to read, 2 minutes to answer on camera. The platform records their video, tracks their eye contact using AI in real time, transcribes their audio on the server, and then sends everything to another AI model that grades the answer against a rubric.

Here's how the system fits together:

```text
User's Browser
    │
    ├─ Camera + Mic (MediaRecorder API)
    ├─ Real-time eye tracking (face-api.js)
    └─ Real-time speech analysis (Web Speech API)
    │
    ▼
React + Vite Frontend (Vercel)
    │
    │ POST /answers (multipart: audio + analytics)
    ▼
FastAPI Backend (Render)
    │
    ├─ Whisper (Groq) — transcribes audio
    ├─ Llama 3.3 70B (Groq) — grades answer vs rubric
    └─ Stores result
    │
    ▼
TiDB Cloud (Serverless MySQL)
```

Every time you submit an answer ➔ audio goes to Groq Whisper ➔ transcript goes to Groq Llama ➔ scores come back ➔ everything gets saved ➔ you see a detailed feedback report.

### Tech Stack:

| What | Tool |
| :--- | :--- |
| **Frontend** | React 19 + Vite |
| **Backend** | FastAPI (Python 3.12) |
| **Database** | TiDB Cloud Serverless |
| **AI Evaluation** | Groq (Llama 3.3 70B + Whisper) |
| **Eye Tracking** | face-api.js |
| **Frontend Host** | Vercel |
| **Backend Host** | Render |
| **Auth** | JWT (python-jose + bcrypt) |

---

## Phase 1 — The Question Bank

Before I wrote a single line of frontend code, I needed something to interview users with. A mock interview platform with generic questions is useless. I wanted company-specific, role-specific questions that felt like the real thing.

I curated 270+ behavioural and situational questions across 13 companies (Google, Amazon, Microsoft, Adobe, Meta, Netflix, Flipkart, JPMorgan, Goldman Sachs, TCS, Infosys, Swiggy, Zomato) and 5 roles per company (Software Engineer, Product Manager, Data Analyst, UX Designer, Operations).

Each question has a rubric. Here's an example:

```json
{
  "company": "JPMorgan",
  "role": "Software Engineer",
  "question_text": "Describe a technical challenge you faced and how you resolved it.",
  "rubric": [
    {"point": "Clearly described the technical problem", "points": 8},
    {"point": "Explained your thought process and approach", "points": 8},
    {"point": "Mentioned specific technologies or tools used", "points": 8},
    {"point": "Quantified the result or outcome", "points": 8},
    {"point": "Reflected on what you learned", "points": 8}
  ],
  "model_answer": "During my internship, our microservice was crashing..."
}
```

> 💡 **Simple version:** Instead of asking the AI "was this answer good?", I give it a checklist with point values. It scores each item on the checklist separately. This means feedback is specific — "you didn't mention the outcome" — instead of just "answer was mediocre."

The rubric matters because it's what the AI uses for grading. Instead of just asking "was this answer good?", I send Groq the rubric and ask it to score each point specifically. This produces much more actionable feedback.

I also built a `seed_db.py` script so anyone can clone the repo and populate their database in one command:

```bash
cd backend
python3 seed_db.py
```

One important design decision: I built a fallback. If someone picks a company/role combination that has no specific questions, the backend returns General HR questions instead of a 404 error. The app never fails silently.

---

## Phase 2 — The Backend (FastAPI + TiDB Cloud)

### Why FastAPI?
FastAPI was the right choice for one specific reason: it handles async I/O natively, and I was going to be making multiple Groq API calls per answer submission. With a synchronous framework, each API call blocks the server. FastAPI's async handlers let me structure the code cleanly even on a budget hosting plan.

### The Database Setup
I chose TiDB Cloud Serverless. It's MySQL-compatible, has a free tier, runs entirely in the cloud, and scales to zero — which matters on a student budget.

The tricky part was SSL configuration. TiDB Cloud requires SSL, and the CA certificate path is different on every operating system. I wrote a fallback chain to handle this automatically:

```python
ca_paths = [
    "/etc/ssl/cert.pem",                  # Render / Alpine
    "/etc/ssl/certs/ca-certificates.crt", # Ubuntu / Debian
    "/etc/pki/tls/certs/ca-bundle.crt"    # CentOS / RHEL
]
ca_path = next((p for p in ca_paths if os.path.exists(p)), None)
connect_args = {"ssl": {"ca": ca_path}}
```

> 💡 **Simple version:** SSL is like a security handshake between your app and the database. To do that handshake, your app needs a specific certificate file — but that file lives in different places on different servers. This code tries each possible location in order until it finds one that exists.

This is one of those things that works perfectly on your local Mac and then fails on Render because Render uses a different Linux distribution. The fallback chain saved me from an hour of debugging SSL errors in production.

The database also had a driver issue. TiDB's connection string sometimes comes back from the dashboard as `mysql://` without the `+pymysql` specifier. SQLAlchemy doesn't know which MySQL driver to use — it defaults to MySQLdb, which I hadn't installed. One-line fix:

```python
if "mysql://" in DATABASE_URL and "+pymysql" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")
```

> 💡 **Simple version:** The database URL is like an address that tells your app how to connect. The "driver" is like choosing which vehicle to use to get there. This line makes sure the right vehicle (PyMySQL) is always specified, even if the address string forgot to mention it.

One line. But it took me 45 minutes to figure out why my database wouldn't connect when the credentials were clearly correct.

### The Data Models
Five models: User, Question, Session, Answer, Feedback.

The `Answer` model is the most complex — it stores everything about a single response:

```python
class Answer(Base):
    transcript          = Column(Text)
    answer_score        = Column(Float)   # out of 40 — Groq grades
    confidence_score    = Column(Float)   # out of 30 — computed locally
    eye_contact_score   = Column(Float)   # out of 30 — from face-api
    filler_word_count   = Column(Integer)
    filler_word_breakdown = Column(JSON)  # {"um": 3, "like": 2}
    speaking_pace       = Column(Float)   # WPM
    pause_count         = Column(Integer)
    gaze_percentage     = Column(Float)   # 0-100
    groq_feedback       = Column(JSON)    # full Groq response
```

The total score (answer + confidence + eye contact) adds up to 100. Content matters most (40%), but delivery and presence both count significantly (30% each).

### JWT Authentication
Standard JWT auth — register, login, protected routes. One detail that matters: token expiry is set to 7 days. For a practice platform where users return daily, forcing re-login after an hour would be annoying. 7 days is the right balance.

> 💡 **Simple version:** JWT is like a temporary pass. When you log in, the server gives you a pass with an expiry date stamped on it. Every time you open the app, you show that pass instead of logging in again. After 7 days the pass expires and you log in once more.

---

## Phase 3 — The AI Evaluation Pipeline

This is the core of MockVue and where most of the interesting engineering happened.

When a user submits an answer, three things need to happen:
1. Transcribe the audio (Groq Whisper)
2. Grade the transcript against a rubric (Groq Llama 3.3 70B)
3. Compute confidence metrics (local calculation)

### Step 1: Audio Transcription
I originally let the browser's Web Speech API handle transcription. It runs locally and is free. But it had two problems: it's unreliable on mobile, and it varies by browser. Some users were getting no transcript at all.

The solution: record the raw audio with MediaRecorder and send it to the backend for Whisper to transcribe:

```python
if audio:
    client = Groq(api_key=api_key)
    transcription = client.audio.translations.create(
        file=(filename, audio_data),
        model="whisper-large-v3-turbo",
        response_format="verbose_json"
    )
    transcript = transcription.text.strip()
```

> 💡 **Simple version:** The browser tries to convert your speech to text in real time, but it often misses things. So instead I also record the actual audio file and send it to Whisper — OpenAI's dedicated speech-to-text model — on the server. Whisper is much more accurate, especially for accented English.

The `verbose_json` format is important. It returns timestamps for each speech segment, which I use to compute pauses:

```python
segments = getattr(transcription, "segments", [])
for i in range(1, len(segments)):
    if segments[i]["start"] - segments[i-1]["end"] >= 3.0:
        current_pause_count += 1
```

Any gap longer than 3 seconds between speech segments counts as a long pause. Whisper gives me this for free.

### Step 2: Answer Grading with Llama

```python
user_prompt = f\"\"\"Interview Question: {question_text}

Rubric (total {total_points} points):
{rubric_text}

Student's Answer: {transcript}

Score each rubric point and provide specific feedback. Return JSON
{{
  "rubric_scores": [
    {{"point": "rubric point text", "score": N, "max": N, "feedback": "text"}}
  ],
  "overall_feedback": "2-3 sentences of specific, actionable feedback",
  "summary": "one sentence summary of the answer quality",
  "total_answer_score": N
}}\"\"\"
```

> 💡 **Simple version:** I'm basically giving the AI a marking scheme and a student's answer, and asking it to fill in a scorecard. By telling it exactly what JSON structure to return, I can reliably parse the response in code.

Three specific design choices here:

1. **Structured output via prompt engineering.** I don't use Groq's JSON mode — I tell the model exactly what JSON structure to return in plain English. The fallback parser strips code blocks in case the model wraps the JSON in backticks anyway:

```python
match = re.search(r'\{.*\}', raw, re.DOTALL)
if match:
    return json.loads(match.group())
```

2. **Low temperature (0.3).** Interview grading should be consistent. I don't want the same answer to get a 28/40 one day and a 35/40 the next.

> 💡 **Simple version:** "Temperature" in AI models controls how creative/random the output is. 0 = always the same answer. 1 = creative and unpredictable. For grading, I want 0.3 — consistent, but not robotically identical.

3. **Graceful degradation.** If Groq fails (rate limit, network error, invalid key), I return a fallback response with zero scores instead of crashing:

```python
except Exception as e:
    return {
        "rubric_scores": [
            {"point": r["point"], "score": 0, "max": r["points"],
             "feedback": "Could not evaluate."}
            for r in rubric
        ],
        "overall_feedback": "Could not evaluate your answer at this time.",
        "total_answer_score": 0
    }
```

The user still gets their confidence and eye contact scores. Their session isn't lost. This kind of defensive programming matters in production.

### Step 3: Confidence Scoring
This is computed entirely on the backend without any AI. I designed a custom scoring formula:

```python
def compute_confidence_score(filler_count, wpm, pause_count):
    # Max 30 points total
    filler_score = max(0.0, 15.0 - filler_count * 1.5)  # # 15 pts max
    
    if 120 <= wpm <= 150:
        wpm_score = 8.0                                 # # 8 pts max
    else:
        distance = min(abs(wpm - 120), abs(wpm - 150))
        wpm_score = max(0.0, 8.0 - distance * 0.1)
        
    pause_score = max(0.0, 7.0 - pause_count * 2.0)     # # 7 pts max
    
    return round(filler_score + wpm_score + pause_score, 1)
```

> 💡 **Simple version:** Three things make you sound confident: not saying "um/uh/like" too much (15 pts), speaking at the right speed — 120 to 150 words per minute (8 pts), and not going silent for more than 3 seconds too often (7 pts). This function just does that math.

The ideal speaking pace is 120–150 WPM — the range commonly cited for professional presentations. Too fast sounds nervous; too slow sounds unsure. The penalty function is smooth, not binary, so someone at 115 WPM isn't punished as harshly as someone at 80 WPM.

---

## The BYOK (Bring Your Own Key) Decision

This was the most consequential product decision I made. MockVue requires users to provide their own Groq API key.

> 💡 **Simple version:** Instead of paying for everyone's AI calls out of my own pocket, each user connects their own free Groq account. Groq gives every account a free usage quota, so each user gets their own limit instead of everyone sharing mine.

Why? Because Groq gives every user a free tier with generous limits. If I ran all evaluations through a single API key, I'd hit rate limits within hours of a few users practicing. By having each user bring their own key, every user gets their own quota, and I pay $0 in API costs.

The key is verified before it's saved:

```python
@router.post("/verify-api-key")
def verify_api_key(data: schemas.ApiKeyVerify):
    try:
        client = Groq(api_key=data.api_key)
        client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=5
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid API Key")
```

A tiny test call — 5 tokens — confirms the key works before saving it. If the key is invalid or the user is over quota, we tell them immediately instead of letting them discover it mid-interview.

---

## Phase 4 — The Frontend

### The Interview Flow
The interview has a deliberate flow built around real AI video assessment platforms:

```text
Setup Page ➔ Camera Check ➔ Interview Page ➔ Processing ➔ Feedback
```

Each transition is intentional. The Camera Check page verifies four things before allowing the user to start:
1. Camera access and video feed
2. Microphone access and audio levels
3. face-api.js models loaded
4. Groq API key active (live test call)

If any of these fail, the user can't start. This prevents a situation where someone answers 5 questions and discovers their microphone was muted the whole time.

### The Reading Phase
One detail that makes MockVue feel like a real assessment: the 30-second reading phase before recording starts. Real AI interview platforms give you reading time. I replicated this with a countdown timer and a beep at 10 seconds remaining:

```javascript
const playBeep = () => {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};
```

> 💡 **Simple version:** The Web Audio API lets you generate sound from scratch in the browser — no audio file needed. I create an oscillator (a tone generator), ramp the volume down quickly to get a sharp beep sound, and play it for 0.3 seconds. One beep = "recording starts in 10 seconds."

Pure Web Audio API. No library needed for a simple beep.

---

## Eye Contact — The Hard Part

This was the most technically complex part of the entire project.

> 💡 **Simple version:** face-api.js is a library that looks at your webcam video and finds faces in it. I use it to figure out whether you're looking at the camera or looking away, and track what percentage of your recording time you spent looking at the camera.

face-api.js is a TensorFlow.js-based library that can detect faces and landmarks in a browser video feed. I use two models: TinyFaceDetector (fast, small) and FaceLandmark68TinyNet (68 facial landmarks).

The naive implementation would be: "is a face detected? yes ➔ looking at camera." But that's wrong. Someone looking down at notes has their face in frame but is clearly not looking at the camera.

The better approach: use facial landmarks to estimate head orientation. Specifically, I use the nose tip and eye positions to compute a lateral ratio:

```javascript
const eyeSpan = rightEye[3].x - leftEye[0].x;
const noseOffset = nose[0].x - leftEye[0].x;
const ratio = noseOffset / eyeSpan;

// Ratio ~0.5 = nose is centered between eyes = facing forward
const isFrontal = ratio > 0.35 && ratio < 0.65;
```

> 💡 **Simple version:** When you look straight at the camera, your nose tip is roughly halfway between your two eyes (horizontally). When you look left or right, the nose appears to "shift" toward one eye. I measure this shift — if the nose is between 35% and 65% across the eye span, you're looking at the camera. If it's outside that range, you're looking away.

### Problem: face-api.js model files
The models are binary weight files (~1–3 MB each) that need to be served as static assets. I couldn't import them from npm — I had to download them and put them in `public/models/`. I wrote a Node.js download script for this:

```javascript
const FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_tiny_model-weights_manifest.json',
  'face_landmark_68_tiny_model-shard1',
];
```

Anyone cloning the repo needs to run this script once before starting the frontend. I missed this in my first README draft and got confused when models silently failed to load on a fresh machine.

### Problem: macOS Safari video readyState
On Safari, `video.readyState` can stay at 1 (HAVE_METADATA) even when the video looks like it's playing. The face detection interval was running but the video element wasn't actually producing pixel data yet, so every frame returned null.

> 💡 **Simple version:** readyState is the video's way of saying how ready it is. State 1 means "I know the video exists." State 2 means "I have actual frames to show you." Safari was stuck at 1, so when face detection asked "what does the video look like right now?" the answer was "nothing." Fix: only run detection when readyState is at least 2.

Fix: check `readyState >= 2` before running detection, and force-call `video.play()` in the interval callback as a safety measure.

### Problem: gaze percentage accuracy
Early testing showed gaze percentages of 20–40% for people clearly looking at the camera. I dropped the face detection score threshold from 0.5 to 0.2 and expanded the frontal ratio window from 0.4–0.6 to 0.35–0.65. After this, numbers for someone looking directly at the camera consistently landed in the 75–90% range.

---

## Phase 5 — The Camera Check Page

The Camera Check page looks simple but has a lot of defensive code underneath. Getting camera and microphone access in a browser is surprisingly fragile. Different operating systems, browsers, and hardware all behave differently. I went through four iterations before the hardware probe logic became reliable:

```javascript
try {
  // Attempt 1: Combined request
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
} catch (probeErr) {
  // Attempt 2: Split request
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.addTrack(audioStream.getAudioTracks()[0]);
  } catch (audioErr) {
    // Attempt 3: Raw audio — bypasses strict macOS CoreAudio
    const rawAudio = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false }
    });
    stream.addTrack(rawAudio.getAudioTracks()[0]);
  }
}
```

> 💡 **Simple version:** Asking for camera and microphone permission can fail in several ways. Instead of giving up on the first failure, I try three progressively simpler requests. The last attempt disables audio processing features (echo cancellation, noise reduction) because macOS sometimes blocks the request when those are turned on and another app is already using the mic.

There's also device selection — dropdowns for switching between multiple cameras or microphones. One subtle point: `enumerateDevices()` doesn't show device labels until the user has already granted permission. So the order wrong and all devices show as "Camera 1", "Microphone 2" with no useful labels.

> 💡 **Simple version:** For privacy reasons, your browser won't tell a website the names of your cameras and microphones until you've already said "yes" to the permission prompt. So the flow must be: ask permission first ➔ then list devices with their real names. Doing it the other way round gets you blank labels.

---

## Phase 6 — Deployment and Cloud Architecture

### Frontend on Vercel
The frontend deployment was the easiest part. Push to GitHub, connect to Vercel, set the `VITE_API_BASE_URL` environment variable to the Render URL, done. The only non-obvious config was `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> 💡 **Simple version:** React apps have one HTML file (`index.html`) and React handles all the different "pages" in JavaScript. But if you directly visit `/dashboard` in the browser, Vercel looks for a file called `dashboard.html`, doesn't find it, and returns a 404. This config tells Vercel: "for any URL, just load index.html and let React figure out the rest."

### Backend on Render
Render's free tier has a cold start problem. If no requests come in for 15 minutes, the service spins down. The next request takes 30–50 seconds while the server wakes up.

I handled this with a "waking up" overlay that detects slow initial connections:

```javascript
const timeout = setTimeout(() => {
  setWakingUp(true);
}, 2500);

api.get('/').then(() => {
  clearTimeout(timeout);
  setWakingUp(false);
});
```

> 💡 **Simple version:** If the backend doesn't respond within 2.5 seconds, I assume it's asleep and show a friendly message explaining the wait. If it responds quickly, the message never appears. This stops users from thinking the app is broken — they know it's just warming up.

If the backend doesn't respond within 2.5 seconds, a friendly "we're on the free tier, this takes ~40 seconds" message appears with a progress bar. Users don't rage-quit; they wait. Honest communication about infrastructure limitations is a UX choice.

The database connection also had a cold start issue. Without the `pool_pre_ping` option, the first database query after a server wakeup fails with "MySQL server has gone away":

```python
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args
)
```

> 💡 **Simple version:** SQLAlchemy keeps a pool of open database connections ready to use. But after the server sleeps and wakes up, those old connections are dead — the database closed them. `pool_pre_ping=True` tells SQLAlchemy to test each connection before using it, and automatically create a fresh one if the old one is dead.

---

## Everything That Went Wrong — Summary

Here's every significant bug I hit and how I fixed it.

### Bug 1: CORS errors on first deployment
The frontend was sending `Authorization: Bearer <token>` headers. CORS preflight requests for credentialed requests are handled differently and were getting blocked.

Fix: Make sure `allow_credentials` and `allow_origins` are compatible — you can't use `["*"]` for origins with `allow_credentials=True` simultaneously.

> 💡 **Simple version:** CORS is a browser security feature that asks the server "is it okay if this website talks to you?" When your request carries a login token, the browser asks this question even more strictly. Getting the server's CORS settings slightly wrong causes the browser to block the request entirely, even though the server itself would have been happy to respond.

### Bug 2: MediaRecorder codec mismatch on iOS Safari
On iOS, `audio/webm` is not supported by MediaRecorder. The recording silently produced an empty blob.

```javascript
let mimeType = 'audio/webm';
if (!MediaRecorder.isTypeSupported(mimeType)) {
  mimeType = 'audio/mp4';
}
```

The file extension sent to Groq Whisper also needs to match the actual format:

```javascript
let ext = 'webm';
if (window.mv_audio_blob.type.includes('mp4')) ext = 'mp4';
formData.append('audio', window.mv_audio_blob, `audio.${ext}`);
```

> 💡 **Simple version:** Different browsers record audio in different file formats — like how some cameras save as JPEG, others as PNG, others as HEIC. Whisper needs to know the format to decode it. If the file says it's `.webm` but it's actually `.mp4` inside, Whisper rejects it. This took two hours to debug because the failure was completely silent — no error, just no transcript.

### Bug 3: React StrictMode double-mount submitting answers twice
In React 18+ with StrictMode, every `useEffect` runs twice on mount in development. My Processing page was calling the answer submission API twice, creating duplicate records.

Fix: A ref guard:

```javascript
const hasSubmitted = useRef(false);

useEffect(() => {
  if (!hasSubmitted.current) {
    hasSubmitted.current = true;
    submitAnswer();
  }
}, []);
```

> 💡 **Simple version:** React's "Strict Mode" deliberately runs your setup code twice in development to help catch bugs. Usually harmless — but if your setup code calls an API, it sends the request twice. A `useRef` variable persists across both runs, so I use it as a "has this already run?" flag. `useState` doesn't work here because React resets state between the two runs.

### Bug 4: TiDB Cloud connection timing out on Render cold start
The database connection would succeed locally but time out on Render after cold start.

```python
connect_args["connect_timeout"] = 10
```

> 💡 **Simple version:** By default, SQLAlchemy waits forever for a database connection to succeed. On Render, after a cold start, the database might take a few seconds to accept connections. Without a timeout, if anything goes wrong, the request just hangs forever instead of failing and letting you retry. 10 seconds is generous enough to handle slow wakeups but short enough to fail fast if something is actually broken.

### Bug 5: face-api.js models loading race condition
The gaze detection interval would start before the models finished loading and throw errors on every frame.

Fix: Always check `faceapi.nets.tinyFaceDetector.isLoaded` at the start of the detection interval:

```javascript
if (!faceapi.nets.tinyFaceDetector.isLoaded) return; // skip this frame
```

> 💡 **Simple version:** The AI models are downloaded from the server asynchronously in the background. But I was starting the detection interval immediately. So for the first few seconds, the interval was running and asking the AI to analyze frames before the AI model had even finished downloading. The fix: just skip any frame where the model isn't ready yet.

### Bug 6: Session score showing 0 mid-interview
The session's `overall_score` was only calculated when the session was marked "complete." Users checking their dashboard mid-interview would see a score of 0.

Fix: Recalculate and update the session score in real-time every time an answer is submitted:

```python
answers = db.query(models.Answer).filter(models.Answer.session_id == session_id).all()
if answers:
    total = sum((a.answer_score or 0) + (a.confidence_score or 0) + (a.eye_contact_score or 0) for a in answers)
    session.overall_score = round(total / len(answers), 1)
```

### Bug 7: Whisper returning empty transcript for short answers
If a user spoke for less than 2 seconds, Whisper sometimes returned an empty string.

Fix: Fall back to the browser's Web Speech API transcript if Whisper returns empty:

```python
result_text = transcription.text.strip()
if result_text:
    transcript = result_text
# else: keep the frontend transcript already in the form data
```

> 💡 **Simple version:** I always send two versions of the transcript to the server: one from the browser's built-in speech recognition (sent as a form field), and one from Whisper (generated on the server from the audio file). If Whisper returns nothing, I use the browser's version as backup. Having two independent sources means something always goes through.

---

## Phase 8 — The Feedback Report

Every MockVue score adds up to 100:

| Component | Max | How it's calculated |
| :--- | :--- | :--- |
| **Answer Quality** | 40 | Groq Llama grades against rubric |
| **Confidence** | 30 | Filler words (15) + WPM (8) + Pauses (7) |
| **Eye Contact** | 30 | `gaze_percentage × 0.3` |

The feedback report breaks down every dimension with specific callouts. The transcript is highlighted — filler words in amber, quality buzzwords in green. The WPM gauge shows pace against the 120–150 ideal zone. The gaze timeline shows a visual representation of camera presence across the recording.

One thing I'm proud of: the priority tip on the Session Complete page. After your session, the system identifies which dimension you scored lowest on proportionally and gives you a specific practice recommendation:

```javascript
const lowestArea = Math.min(avgAnswer / 40, avgConfidence / 30, avgGaze / 30) === avgAnswer / 40
  ? { area: 'Answer Quality', tip: 'Focus on the STAR method...' }
  : Math.min(avgConfidence / 30, avgGaze / 30) === avgConfidence / 30
  ? { area: 'Confidence', tip: 'Practise out loud daily...' }
  : { area: 'Eye Contact', tip: 'Place a sticker dot above your camera...' };
```

> 💡 **Simple version:** Raw scores aren't comparable — 20/40 on answers isn't the same as 20/30 on eye contact. So I convert each score to a percentage of its maximum (answer: /40, confidence: /30, eye contact: /30) before comparing. The lowest percentage tells me which area genuinely needs the most work.

---

## What I'd Do Differently

1. **Use a job queue for AI processing.** Right now the answer submission endpoint is synchronous — it calls Whisper, then Llama, then saves to database, all in one request. On Render's free tier this takes 8–15 seconds while the connection hangs. A proper solution would queue the AI processing and let the frontend poll for results.
2. **Add rate limiting.** The `/auth/register` endpoint has no rate limiting. A bot could create thousands of accounts. Libraries like `slowapi` for FastAPI make this a 10-minute addition.
3. **Store recordings temporarily.** Right now the audio blob is processed and discarded. Storing it for 24 hours in S3 would let users replay their answers alongside the transcript — significantly more useful for self-improvement.
4. **Calibrate eye tracking per user.** The nose-to-eye ratio works for most setups but breaks if someone's camera is off-center or they have an unusual setup. A brief calibration step at the Camera Check page would make scores more accurate.
5. **Ship the feedback report first.** I built the scoring system last, but it's the most important thing from a user perspective. I should have designed the feedback report first and worked backwards to figure out what data I needed to collect. I wasted time building features that didn't contribute to the quality of the feedback.

---

## Key Takeaways

- **The BYOK model is underrated.** Making users bring their own API keys is usually seen as friction. For this use case, it was the right call. Every user gets their own rate limit, infrastructure costs stay at $0, and the app can scale without me paying per-evaluation.
- **Defensive code is worth every line.** The three-attempt hardware probe, the Whisper fallback, the `pool_pre_ping`, the `hasSubmitted` ref guard — none of these are in tutorials. They all came from real failures. Every edge case I handled made the app more trustworthy.
- **Face detection in the browser is doable but finicky.** face-api.js is mature, but integrating it with MediaRecorder and real-time React state requires care. The key insight: run it in a `setInterval`, not in React's rendering cycle. Keep all heavy computation in refs.
- **Honest UI for free-tier limitations is good UX.** Instead of hiding the cold start problem, I surfaced it with a friendly message. Users understood. They waited. Nobody complained about the 40-second wakeup time in feedback — they complained about things I could actually fix.
- **Real projects break in real ways.** Every tutorial shows you the happy path. Building MockVue meant hitting SSL certificate paths, iOS codec incompatibilities, React StrictMode double-mounts, browser permission ordering requirements, and model loading race conditions. Debugging these is the actual job of a developer.

---

## Resources

- Live app: `mock-vue.vercel.app`
- GitHub: `github.com/shlokbam/MockVue`
- Groq API (free): `console.groq.com`
- face-api.js: `github.com/vladmandic/face-api`
- TiDB Cloud: `tidbcloud.com`
- FastAPI docs: `fastapi.tiangolo.com`
"""
        existing_mockvue = db.query(Post).filter(Post.slug == mockvue_slug).first()
        if not existing_mockvue:
            mockvue_post = Post(
                title="I Built an AI-Powered Mock Interview Platform from Scratch — Here's Everything That Went Wrong",
                slug=mockvue_slug,
                excerpt="A full walkthrough of building MockVue — React + FastAPI + TiDB Cloud + Groq AI + face-api.js — including every bug, every architectural decision, and every 'why is this not working' moment.",
                content=mockvue_content,
                content_type="BUILD",
                category="AI",
                reading_time="28 min read",
                status="PUBLISHED",
                featured=True,
                published_at="2026-04-05",
                github_repo="shlokbam/MockVue"
            )
            db.add(mockvue_post)
        else:
            existing_mockvue.content = mockvue_content
            existing_mockvue.reading_time = "28 min read"
            existing_mockvue.published_at = "2026-04-05"

        # Seed 4th Article — Eagle LMS
        lms_slug = "i-built-an-enterprise-lms-with-local-cloud-devops-from-scratch-here-s-everything-that-went-wrong"
        lms_content = """![Building Eagle LMS Banner](hero-banner)

# Building Eagle LMS: How I Led a Full-Stack Industry-Sponsored Project from Napkin to Production

**By Shlok Bam — Project Lead, Eagle LMS**  
**Academic Guide:** Mrs. Pallavi Malji Khalde  
**Industry Mentors:** Mr. Manish Godse & Mr. Shashikant Sir, Eagle Industrial Services Pvt. Ltd.  

This is a deep-dive into a real, ongoing, industry-sponsored college project. The code is reviewed. The product is in testing. The bugs were real. I'm writing this while it's still fresh — because in six months, you forget the pain.

---

## 1. Why I Built This

**Eagle Industrial Services Pvt. Ltd.** is a Pune-based security and facility management company with over 2,500 employees, 110+ clients, and 15+ years in operations. They run everything from security guard deployment to housekeeping and QRT (Quick Response Team) response teams.

This project was given to our entire department as an industry-sponsored initiative, with different teams taking on different modules of a larger system. Our team of five was assigned the **Learning Management System** — the training and assessment platform for Eagle's workforce.

Eagle already had an operational system in place. It was not broken — a company operating at their scale with their client base doesn't survive on broken systems. But the LMS component specifically was an area identified for modernisation. The goal was to build something purpose-built for their training workflows: **phased content delivery**, **scheduled assessments**, **per-user progress tracking**, and **performance reports** that a trainer could actually use.

Mr. Manish Godse came to our college with a clear picture of what was needed. We listened, we documented everything, and we built it.

---

## 2. What I Built

Eagle LMS is a full-stack training platform built specifically for Eagle Industrial Services. It has three core parts:

1. **A Web Portal for Trainers and Trainees (React + Vite):** Trainers create modules, upload materials, schedule sessions, create timed MCQ tests, and view performance reports. Trainees access enrolled modules, open materials, take tests, and track progress.
2. **A React Native Mobile App (Expo):** Built for both roles (trainers and trainees) after the web portal was validated across the first three meetings.
3. **A Shared FastAPI Backend:** Serving both web and mobile from the same API endpoints and the same MySQL database.

The system is **role-based** (trainer vs trainee), **phase-aware** (materials and tests unlock based on whether a session is pre, live, or post), and includes **per-user watermarking** on every PDF and image served to trainees.

### Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                       │
│                                                        │
│   React + Vite (Web)          React Native + Expo      │
│   ┌─────────────┐             ┌─────────────────┐      │
│   │ Trainer UI  │             │  Trainer App    │      │
│   │ Trainee UI  │             │  Trainee App    │      │
│   └──────┬──────┘             └────────┬────────┘      │
└──────────┼─────────────────────────────┼───────────────┘
           │ JWT Bearer Token            │ JWT Bearer Token
           ▼                             ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI BACKEND                        │
│                                                         │
│   /api/auth     /api/trainer    /api/trainee            │
│   /api/notifications  /api/progress  /uploads/{file}    │
│                                                         │
│   Auth Layer: JWT decode → role check → dependency      │
│   File Layer: watermark generated per user on serve     │
└────────────────────────────┬────────────────────────────┘
                             │ SQLAlchemy ORM
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     MySQL DATABASE                      │
│                                                         │
│  users → modules → chapters → materials                 │
│       → tests → questions → test_attempts               │
│       → enrollments → progress → notifications          │
└─────────────────────────────────────────────────────────┘
```

> 💡 **Simple version:** Think of it like Udemy, but built specifically for a security company's internal training. Trainers are like course creators. Trainees are like students. The backend is the engine connecting them. The database is where everything is stored.

---

## 3. Tech Stack

| Layer | Technology | Why We Chose It |
| :--- | :--- | :--- |
| **Backend API** | FastAPI (Python) | Fast, async, auto-generates docs at `/docs` |
| **ORM** | SQLAlchemy 2.0 | Declarative models, clean query interface |
| **Database** | MySQL 8 + PyMySQL | Production-grade, relational, matches existing infra |
| **Auth** | JWT + SHA-256 | Matched existing Flask app's password hashing |
| **File Handling** | Pillow + pypdf + ReportLab | Per-user watermarking on PDFs and images |
| **Web Frontend** | React 18 + Vite + Router v6 | Fast dev server, SPA routing, component model |
| **HTTP Client** | Axios | Interceptors for JWT attachment and 401 auto-redirect |
| **Mobile** | React Native + Expo | Cross-platform iOS/Android from one codebase |
| **Mobile Storage** | Expo SecureStore | JWT stored securely on device, not in plain storage |
| **Styling** | Custom CSS design system | Full dark/light mode, no component library needed |

---

## 4. The Journey — Meeting by Meeting

| # | Title | What Happened |
| :--- | :--- | :--- |
| **Meeting 1** | Requirements | Mr. Godse explained the full system precisely. We documented every requirement. This session became the spec — and it saved us from rework later. |
| **Meeting 2** | First Demo | Two weeks later — full UI + functionality shown. He was impressed. Still had UI and logic gaps. We wrote down every correction. |
| **Meeting 3** | Refined Build | Improved UI and functionality approved. Database, frontend, and backend validated. More small corrections guided. |
| **Meeting 4** | Mobile Brief | Fully satisfied with web portal. New ask: build a mobile app for trainers and trainees. We had never done React Native before. |
| **Meeting 5** | Mobile Demo Crash | App crashed during demo. Sir was calm. He gave UI feedback, then asked us to build the trainer app too. |
| **Meeting 6** | Full Sync Demo | Both apps syncing with web in real-time. Trainer creates on web, trainee sees it on mobile instantly. Sir tells us next meeting will include a technical reviewer. |
| **Meeting 7** | Shashikant Sir Review | Longest meeting. App crashed again. Both sirs were calm. Shashikant Sir walked through the whole codebase, explained Eagle's operational workflow, what gaps our system fills, and what improvements to make. Told us to push to GitHub and make him a contributor. |

---

## 5. Phase by Phase: How I Actually Built It

### Phase 1 — Requirements & Database Design

The first meeting with Mr. Manish Godse set the tone for the entire project. He didn't come with vague ideas. He came with a clear picture — role-based access, phased content release, timed tests, watermarked materials, performance reports. I noted down every requirement precisely.

The database schema came directly from this meeting. I designed it before writing a single line of application code:

```text
users (id, name, email, password, role, phone, department, profile_pic)
  │
  ├── modules (trainer_id, title, description, category,
  │           start_datetime, end_datetime, status,
  │           training_type, meet_link, color)
  │     │
  │     ├── chapters (module_id, title, order_num)
  │     │     └── materials (chapter_id, title, file_path,
  │     │                   release_phase, order_num)
  │     │
  │     ├── tests (module_id, title, test_type[pre/mid/post],
  │     │         duration_minutes, passing_marks, max_attempts)
  │     │       └── questions (test_id, question_text,
  │     │                     option_a/b/c/d, correct_option, marks)
  │     │             └── test_attempts (test_id, trainee_id,
  │     │                               score, percentage, passed)
  │     │
  │     └── enrollments (module_id, trainee_id)
  │
  └── progress (module_id, trainee_id, material_id, completed)
      notifications (user_id, title, body, type, is_read)
```

> 💡 **Simple version:** Before writing code, I drew out exactly what information the system needed to store and how everything connects. This is called a database schema — the blueprint for your data. A good schema designed upfront saves you from painful restructuring later.

---

### Phase 2 — Backend API

The backend is a FastAPI application split into domain-specific routers: `auth`, `trainer`, `trainee`, `progress`, `notifications`, and `files`. Every protected route uses a dependency injection chain that decodes the JWT, loads the user, and optionally checks their role:

```python
def get_current_user(credentials, db) -> models.User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(401, "Invalid or expired token")
    user = db.query(models.User).filter(
        models.User.id == int(payload.get('sub'))
    ).first()
    return user

def require_trainer(current_user = Depends(get_current_user)):
    if current_user.role != "trainer":
        raise HTTPException(403, "Trainer access required")
    return current_user
```

> 💡 **Simple version:** Every time a request arrives at a protected route, this code runs first — automatically. It checks: is this person logged in? Do they have permission? Think of it as a security guard at every door who checks your ID before letting you through.

One specific auth decision deserves explanation. Eagle already had an existing application that used SHA-256 password hashing. Bcrypt is more secure, but switching would have invalidated every existing employee account. So I matched the existing behaviour intentionally — a pragmatic tradeoff chosen with full awareness of its implications.

#### Phase-Based Content Locking

Materials are tagged as `pre`, `live`, or `post`. The system calculates the current module phase from its start and end datetimes, then determines what's accessible:

```python
PHASE_ORDER = {'pre': 1, 'live': 2, 'post': 3, 'upcoming': 0}

def canAccess(matPhase, modulePhase):
    return PHASE_ORDER[matPhase] <= PHASE_ORDER[modulePhase]
```

A pre-session PDF is accessible during pre, live, and post. A post-session summary is locked until the session has started. This logic is enforced both on the frontend (UI shows 'Locked') and on the backend (the file serve endpoint checks the phase before serving the file).

> 💡 **Simple version:** Imagine a textbook where chapter 3 is glued shut until you finish chapter 2. That's what this does — certain training materials only unlock at the right stage of the session.

---

### Phase 3 — The Watermarking System

Every PDF and image served to a trainee gets a personalised watermark containing the company name and the trainee's email address. It is generated on-the-fly the first time a user accesses a file, then cached for subsequent requests:

```python
@router.get('/uploads/{filename}')
def serve_file(filename, token, db):
    current_user = _get_user_from_request(token, db)
    if current_user and current_user.role == 'trainee':
        wm_filename = f'wm_{current_user.id}_{filename}'
        wm_path = os.path.join(UPLOAD_DIR, wm_filename)
        if not os.path.exists(wm_path):
            text = f'Eagle Securities | {current_user.email}'
            if ext == 'pdf':
                watermark_pdf(file_path, wm_path, text)
            else:
                watermark_image(file_path, wm_path, text)
        return FileResponse(wm_path)
```

> 💡 **Simple version:** If a trainee downloads a training PDF and shares it externally, every page shows their name and email. Each person gets their own copy of the file with their identity baked in. This discourages leaking of confidential training materials.

For PDFs, this uses `pypdf` to overlay a `ReportLab` canvas with rotated semi-transparent text on every page. For images, `Pillow` composites a tiled text overlay at low opacity. The file is generated once per user-file pair and cached on disk.

---

### Phase 4 — The Web Frontend

The web frontend is a React SPA with React Router v6, built entirely with a custom CSS design system using CSS variables. No Tailwind, no component library — all custom. The design system supports full dark/light mode via a `data-theme` attribute on the `html` element.

The test engine was particularly interesting to build. A trainee gets a timed MCQ test with a countdown timer. The timer lives in React state, decremented via `setTimeout`, and auto-submits at zero. Critically, score calculation is done server-side:

```python
# Backend score calculation — client sends answers, server checks
score = 0
for q in questions:
    if answers_dict.get(str(q.id)) == q.correct_option:
        score += q.marks

pct = (score / total * 100)
passed = pct >= test.passing_marks
```

> 💡 **Simple version:** Always calculate grades on the server, never on the client. A user could manipulate JavaScript in their browser to send a fake score. The server doesn't trust what the client says the score was — it recalculates it from the raw answers.

The result page has an animated SVG score ring — a circle with `stroke-dashoffset` that animates to the score percentage. The trainer reports page shows per-trainee, per-test performance in a table with pass/fail badges.

---

### Phase 5 — Learning React Native and Building the Mobile App

After meeting four, the brief was clear: build a mobile app. I had never written React Native before.

I spent a week learning the fundamentals — `View` instead of `div`, `StyleSheet` instead of CSS, a separate navigation library, `expo-document-picker` for files, `expo-secure-store` for secure token storage instead of `localStorage`. The concepts carry over from React Web, but every primitive is different.

The mobile app shares the same FastAPI backend. The base URL auto-detects the development machine's IP so Android emulators can reach the host machine:

```javascript
const debuggerHost = Constants.expoConfig?.hostUri;
let localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

if (Platform.OS === 'android' && localhost === 'localhost') {
  localhost = '10.0.2.2'; // Android emulator → host machine
}
```

> 💡 **Simple version:** Android emulators run inside a virtual machine. They can't use 'localhost' to reach your laptop's server — they use a special address (10.0.2.2) that means 'the computer I'm running inside of.' This line handles that automatically.

---

## 6. Every Bug That Hurt

### Bug 1 — The Cascading State Problem
This was the most persistent pain point of the entire project. Because the application is large and heavily interconnected — notifications trigger on material upload, enrollments update on module publish, progress feeds into dashboard stats — fixing one thing kept breaking something else.

Solve the test submission logic, and the trainee dashboard percentage stops recalculating. Fix the chapter delete cascade, and material ordering breaks. Fix the file URL for mobile, and the web watermark cache misses.

The root cause was always the same: fixing a query or state update path without tracing all downstream consumers of that data.

The fix was disciplined: after every change, run the full user flow. Login as trainee, check dashboard, open a module, open materials, take a test, check result, check profile stats. Tedious but non-negotiable.

> 💡 **Simple version:** In a big app, everything connects to everything. Fixing one leak sometimes opens another one unexpectedly. The only real fix is testing the whole flow after every change, not just the specific thing you touched.

---

### Bug 2 — The File Serving Auth Problem
When a trainee clicks 'Open PDF,' the frontend opens it in an iframe. The problem: a browser's iframe tag makes a plain HTTP GET request. It cannot attach an `Authorization: Bearer` header — that's only possible from JavaScript `fetch()` or Axios.

The PDF endpoint returned a 401. The iframe showed nothing. No error in the console. The 401 was silently consumed by the browser — the hardest kind of bug to diagnose.

The fix was a query-parameter token approach. The backend was updated to accept the JWT from either the `Authorization` header or a `?token=` query parameter:

```python
def _get_user_from_request(token, db):
    if not token: return None
    payload = decode_token(token)
    if not payload: return None
    return db.query(models.User).filter_by(
        id=int(payload.get('sub', 0))
    ).first()
```

> 💡 **Simple version:** Think of it like a bouncer checking ID. Your JavaScript can hand over its ID smoothly. But when a browser navigates directly to a URL — like showing a PDF in a frame — it can't carry any ID. So we put the ID in the URL itself. It's a known tradeoff, appropriate for an internal corporate system.

---

### Bug 3 — The Phase Logic Clock Mismatch
The test phase logic had a subtle bug. Test availability checks (is this test window open?) were being done by comparing the test's `start_datetime` against the client's local JavaScript clock. The backend was doing the same comparison against its own clock.

A trainee could see a 'Take Test' button on the frontend — client clock said it was open — but the backend would return a 403 because its clock said otherwise. The error message was opaque: 'Test window closed.'

The fix was to include the server's current timestamp in the module API response and have the client use that for all time comparisons:

```python
return {
    "module": ...,
    "phase": phase,
    "now_iso": datetime.now().isoformat(), # client uses this
}
```

> 💡 **Simple version:** Your laptop's clock and the server's clock may differ. If test availability is based on a time comparison and both sides use different clocks, they'll disagree. Solution: always use the server's time for time-sensitive decisions.

---

### Bug 4 — The Silent `meet_link` Schema Gap
Midway through the project, a new requirement came in: add training types (self-paced, virtual, classroom) and a `meet_link` field for virtual and classroom sessions. The modules table already existed, so I wrote a migration script to add the new columns.

The bug: I forgot to update the Pydantic `ScheduleRequest` schema to include `meet_link`. The frontend was sending it. The backend received it but silently discarded it — not declared in the schema, not validated, not saved. No exception. No error. Just silent data loss.

> 💡 **Simple version:** Always check that both sides of a data flow speak the same language. When you add a field to the database, also add it to the schema that receives the data, and the schema that returns it. One missed step and data disappears quietly.

---

### Bug 5 — React Native File Upload on Android
The mobile app's material upload feature uses `expo-document-picker`. On iOS, the picked file's URI works as-is. On Android, the URI is a content URI (`content://...`) that can't be read by a plain HTTP request.

The Axios multipart upload was failing silently on Android — no useful error, just no file arriving at the server.

The fix was ensuring the `FormData` object was constructed with the exact shape React Native's `XMLHttpRequest` implementation expects:

```javascript
formData.append('file', {
  uri: uploadForm.file.uri,   // content:// URI on Android
  name: uploadForm.file.name,
  type: uploadForm.file.mimeType || 'application/octet-stream',
});
```

> 💡 **Simple version:** iOS and Android handle file paths differently. Android uses a special reference code for files instead of a simple path. React Native knows how to send this code to a server — but only if you tell it the exact format. Missing the type field causes silent failure.

---

## 7. The Meeting That Mattered Most

Meeting seven was the longest of the project. Mr. Shashikant Sir — a senior technical person from Eagle — watched a live demo. The app crashed again during it.

Both sirs were completely calm. Shashikant Sir said something I won't forget: *"We've all come through this way."*

He then spent an extended session explaining how Eagle's operations actually work — the training schedules for guards spread across client sites, the difficulty of tracking who completed what, how a new system plugs into their workflow. He explained the gaps our LMS was built to fill and what improvements would make it production-ready.

At the end of the meeting, he asked me to push the code to GitHub and make him a contributor. He would review the code and send detailed feedback.

Current status: the portal is ready for testing. Code review is in progress.

> 💡 **Simple version:** A crash in a demo is not a failure — it's data. What matters is the response. Staying calm, understanding what failed, fixing it, and coming back better is what professionals do. This was perhaps the most important lesson of the project.

---

## 8. What I'd Do Differently

1. **Start with API versioning (`/api/v1/...`):** When the mobile app needed slightly different response shapes, I had to add conditional logic inside existing endpoints. Versioned routes from day one would have kept this clean.
2. **Use Alembic for migrations instead of raw `ALTER TABLE` scripts:** The `migrate.py` approach works but is fragile. Alembic gives you versioned, reversible migrations tracked in git alongside the code.
3. **Abstract the phase logic into one shared utility:** The `_get_phase()` function exists in two different routers with slightly different implementations. Two versions of the same logic means two places to fix when requirements change.
4. **Test on real devices earlier:** Both demo crashes happened because emulator testing was thorough but real-device testing under real network conditions started too late. It should start at the same time as feature development.
5. **Keep a bug log during development:** A simple markdown file tracking 'what I changed and what it affected' would have made the cascading bug problem far easier to diagnose.

---

## 9. Key Takeaways

Working on this project across seven meetings and several months taught me things that no classroom session delivers.

- **Requirements documentation is an engineering skill:** The reason meeting one went well is that I treated note-taking as seriously as coding. Every detail Mr. Godse explained was written down precisely. That document became the spec. The spec became the schema. The schema became the code. The schema I designed in meeting one survived all seven meetings with only two added columns.
- **Big applications break at integration points, not in isolation:** Individual features worked perfectly in development. Things broke when they interacted with each other under real usage. Integration testing is not optional, and you need to run full user flows regularly — not just unit test individual functions.
- **Industry experience is irreplaceable:** When Shashikant Sir walked through the codebase and explained how their operations actually work, it reframed the entire project. You can build a technically correct system and still miss the point if you don't understand the domain it's serving. That extended session was worth more than any tutorial.
- **Calm in a crisis is a professional skill:** The app crashed twice in front of industry professionals. Both times, what mattered was the response — understanding the failure, fixing it, and coming back better. That's the standard.

---

## 10. Resources & References

- **FastAPI documentation:** `fastapi.tiangolo.com`
- **SQLAlchemy ORM:** `docs.sqlalchemy.org`
- **React Router v6:** `reactrouter.com`
- **Expo React Native:** `docs.expo.dev`
- **pypdf (PDF manipulation):** `pypdf.readthedocs.io`
- **Pillow (image processing):** `pillow.readthedocs.io`
- **python-jose (JWT):** `python-jose.readthedocs.io`

*Eagle LMS is an ongoing industry-sponsored project by a team of five students, under the guidance of Mrs. Pallavi Malji Khalde. The project is currently in the testing and code review phase with Eagle Industrial Services Pvt. Ltd.*
"""
        existing_lms = db.query(Post).filter(Post.slug == lms_slug).first()
        if not existing_lms:
            lms_post = Post(
                title="Building Eagle LMS: How I Led a Full-Stack Industry-Sponsored Project from Napkin to Production",
                slug=lms_slug,
                excerpt="The authentic story of leading a team of 5 to build Eagle LMS for Eagle Industrial Services — dual-role web & React Native mobile app, dynamic watermarking, phase-based unlocking, and surviving 7 industry review meetings.",
                content=lms_content,
                content_type="BUILD",
                category="DevOps",
                reading_time="25 min read",
                status="PUBLISHED",
                featured=True,
                published_at="2026-04-18",
                github_repo="shlokbam/lms"
            )
            db.add(lms_post)
        else:
            existing_lms.title = "Building Eagle LMS: How I Led a Full-Stack Industry-Sponsored Project from Napkin to Production"
            existing_lms.excerpt = "The authentic story of leading a team of 5 to build Eagle LMS for Eagle Industrial Services — dual-role web & React Native mobile app, dynamic watermarking, phase-based unlocking, and surviving 7 industry review meetings."
            existing_lms.content = lms_content
            existing_lms.reading_time = "25 min read"
            existing_lms.published_at = "2026-04-18"

        db.commit()

    finally:
        db.close()

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "author": "Shlok Bam",
        "docs": "/docs"
    }
