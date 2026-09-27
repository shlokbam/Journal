// API service layer with backend API integration + mock data fallback
import { MOCK_POSTS, MOCK_EXPERIMENTS, MOCK_PROFILE } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchWithFallback(url, fallbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    // Graceful fallback to mock data when backend is starting or offline
    return fallbackData;
  }
}

export const postsApi = {
  getAll: async (params = {}) => {
    let posts = await fetchWithFallback('/posts', MOCK_POSTS);
    
    // Apply frontend filtering if using fallback data
    if (params.type && params.type !== 'ALL') {
      posts = posts.filter(p => p.content_type?.toUpperCase() === params.type.toUpperCase());
    }
    if (params.tag) {
      posts = posts.filter(p => p.tags.map(t => t.toLowerCase()).includes(params.tag.toLowerCase()));
    }
    if (params.query) {
      const q = params.query.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) || 
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return posts;
  },
  
  getBySlug: async (slug) => {
    const post = await fetchWithFallback(`/posts/${slug}`, MOCK_POSTS.find(p => p.slug === slug));
    return post || MOCK_POSTS.find(p => p.slug === slug);
  }
};

export const experimentsApi = {
  getAll: async () => {
    return await fetchWithFallback('/experiments', MOCK_EXPERIMENTS);
  }
};

export const profileApi = {
  get: async () => {
    return await fetchWithFallback('/profile', MOCK_PROFILE);
  }
};

export const githubApi = {
  getRepo: async (owner, repo) => {
    return await fetchWithFallback(`/github/${owner}/${repo}`, null);
  }
};

export const searchApi = {
  search: async (query) => {
    if (!query || query.trim() === '') return { posts: [], experiments: [] };
    const q = query.toLowerCase().trim();
    
    const posts = MOCK_POSTS.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q))
    );
    
    const experiments = MOCK_EXPERIMENTS.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.summary.toLowerCase().includes(q) || 
      e.tags.some(t => t.toLowerCase().includes(q))
    );
    
    return { posts, experiments };
  }
};
