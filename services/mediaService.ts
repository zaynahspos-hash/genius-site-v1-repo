const API_URL = 'http://localhost:5000/api/admin/media';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const mediaService = {
  async getMedia(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}?${query}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch media');
    return await res.json();
  },

  async upload(files: File[], folderId: string | null = null) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (folderId) formData.append('folderId', folderId);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { ...getAuthHeader() }, // Do not set Content-Type for FormData
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  },

  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Update failed');
    return await res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Delete failed');
    return await res.json();
  },

  async bulkDelete(ids: string[]) {
    const res = await fetch(`${API_URL}/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ids })
    });
    if (!res.ok) throw new Error('Bulk delete failed');
    return await res.json();
  },

  async bulkMove(ids: string[], folderId: string | null) {
    const res = await fetch(`${API_URL}/bulk-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ids, folderId })
    });
    if (!res.ok) throw new Error('Bulk move failed');
    return await res.json();
  },

  async getFolders() {
    const res = await fetch(`${API_URL}/folders`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch folders');
    return await res.json();
  },

  async createFolder(name: string, parent: string | null = null) {
    const res = await fetch(`${API_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, parent })
    });
    if (!res.ok) throw new Error('Create folder failed');
    return await res.json();
  },

  async deleteFolder(id: string) {
    const res = await fetch(`${API_URL}/folders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Delete folder failed');
    return await res.json();
  },

  async getStats() {
    const res = await fetch(`${API_URL}/stats`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  }
};