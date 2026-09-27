// API service layer with backend API integration + publication content fallback
import { JOURNAL_POSTS, EXPERIMENTS_DATA, PROFILE_DATA } from './journalData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchWithFallback(url, fallbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    // Graceful fallback to primary article store when backend is starting or offline
    return fallbackData;
  }
}

export const postsApi = {
  getAll: async (params = {}) => {
    let posts = await fetchWithFallback('/posts', JOURNAL_POSTS);
    
    // Apply filtering if using static dataset
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
    const post = await fetchWithFallback(`/posts/${slug}`, JOURNAL_POSTS.find(p => p.slug === slug));
    return post || JOURNAL_POSTS.find(p => p.slug === slug);
  }
};

export const experimentsApi = {
  getAll: async () => {
    return await fetchWithFallback('/experiments', EXPERIMENTS_DATA);
  }
};

export const profileApi = {
  get: async () => {
    return await fetchWithFallback('/profile', PROFILE_DATA);
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
    
    const posts = JOURNAL_POSTS.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q))
    );
    
    const experiments = EXPERIMENTS_DATA.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.summary.toLowerCase().includes(q) || 
      e.tags.some(t => t.toLowerCase().includes(q))
    );
    
    return { posts, experiments };
  }
};
