import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/blog`;

export const blogService = {
  // Posts
  async getPosts(isAdmin = false) {
    const query = isAdmin ? '?admin=true' : '';
    const res = await safeFetch(`${API_URL}/posts${query}`);
    return await res.json();
  },

  async getPostBySlug(slug: string) {
    const res = await safeFetch(`${API_URL}/posts/${slug}`);
    return await res.json();
  },

  async savePost(post: any) {
    const res = await safeFetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post)
    });
    return await res.json();
  },

  async deletePost(id: string) {
    const res = await safeFetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  },

  // Categories
  async getCategories() {
    const res = await safeFetch(`${API_URL}/categories`);
    return await res.json();
  },

  async saveCategory(category: any) {
    const res = await safeFetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(category)
    });
    return await res.json();
  },

  async deleteCategory(id: string) {
    const res = await safeFetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  }
};