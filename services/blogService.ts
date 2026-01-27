const API_URL = 'http://localhost:5000/api/blog';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const blogService = {
  // Posts
  async getPosts(isAdmin = false) {
    const query = isAdmin ? '?admin=true' : '';
    const res = await fetch(`${API_URL}/posts${query}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  },

  async getPostBySlug(slug: string) {
    const res = await fetch(`${API_URL}/posts/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return await res.json();
  },

  async savePost(post: any) {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to save post');
    return await res.json();
  },

  async deletePost(id: string) {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return await res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  async saveCategory(category: any) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Failed to save category');
    return await res.json();
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return await res.json();
  }
};