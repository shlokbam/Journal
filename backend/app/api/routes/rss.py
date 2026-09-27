import html
import email.utils
from datetime import datetime
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Post

router = APIRouter()

def format_rfc822(date_val, created_at=None):
    if isinstance(date_val, str):
        try:
            dt = datetime.strptime(date_val, "%Y-%m-%d")
            return email.utils.formatdate(dt.timestamp(), usegmt=True)
        except Exception:
            pass
        try:
            dt = datetime.fromisoformat(date_val)
            return email.utils.formatdate(dt.timestamp(), usegmt=True)
        except Exception:
            pass
    if isinstance(created_at, datetime):
        return email.utils.formatdate(created_at.timestamp(), usegmt=True)
    return email.utils.formatdate(datetime.utcnow().timestamp(), usegmt=True)

@router.get("/rss.xml", response_class=Response)
@router.get("/api/rss.xml", response_class=Response)
def get_rss_feed(db: Session = Depends(get_db)):
    posts = (
        db.query(Post)
        .filter((Post.status == "PUBLISHED") | (Post.status.is_(None)))
        .order_by(Post.id.desc())
        .limit(20)
        .all()
    )

    channel_title = "Shlok Bam | Tech Journal"
    channel_link = "https://journal-murex-three.vercel.app/"
    channel_desc = "Personal tech journal and engineering notes by Shlok Bam."
    feed_url = "https://journal-backend-ypg5.onrender.com/rss.xml"

    last_build_date = (
        format_rfc822(posts[0].published_at, posts[0].created_at)
        if posts
        else email.utils.formatdate(usegmt=True)
    )

    items_xml = []
    for p in posts:
        post_url = f"https://journal-murex-three.vercel.app/journal/{p.slug}"
        pub_date = format_rfc822(p.published_at, p.created_at)
        desc = html.escape(p.excerpt if p.excerpt else (p.content[:300] if p.content else ""))
        title = html.escape(p.title or "")

        item = f"""    <item>
      <title>{title}</title>
      <link>{post_url}</link>
      <description>{desc}</description>
      <pubDate>{pub_date}</pubDate>
      <guid isPermaLink="true">{post_url}</guid>
    </item>"""
        items_xml.append(item)

    items_str = "\n".join(items_xml)

    xml_output = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{html.escape(channel_title)}</title>
    <link>{channel_link}</link>
    <description>{html.escape(channel_desc)}</description>
    <language>en-us</language>
    <lastBuildDate>{last_build_date}</lastBuildDate>
    <atom:link href="{feed_url}" rel="self" type="application/rss+xml"/>
{items_str}
  </channel>
</rss>"""

    return Response(content=xml_output, media_type="application/rss+xml")
