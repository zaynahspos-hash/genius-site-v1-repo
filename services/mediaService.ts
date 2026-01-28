import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/admin/media`;

export const mediaService = {
  async getMedia(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_URL}?${query}`, { headers: getAuthHeader() });
    return await res.json();
  },

  async upload(files: File[], folderId: string | null = null) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (folderId) formData.append('folderId', folderId);

    const res = await safeFetch(API_URL, {
      method: 'POST',
      headers: { ...getAuthHeader() }, // Do not set Content-Type for FormData
      body: formData
    });
    return await res.json();
  },

  async update(id: string, data: any) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async delete(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  },

  async bulkDelete(ids: string[]) {
    const res = await safeFetch(`${API_URL}/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ids })
    });
    return await res.json();
  },

  async bulkMove(ids: string[], folderId: string | null) {
    const res = await safeFetch(`${API_URL}/bulk-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ids, folderId })
    });
    return await res.json();
  },

  async getFolders() {
    const res = await safeFetch(`${API_URL}/folders`, { headers: getAuthHeader() });
    return await res.json();
  },

  async createFolder(name: string, parent: string | null = null) {
    const res = await safeFetch(`${API_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, parent })
    });
    return await res.json();
  },

  async deleteFolder(id: string) {
    const res = await safeFetch(`${API_URL}/folders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  },

  async getStats() {
    const res = await safeFetch(`${API_URL}/stats`, { headers: getAuthHeader() });
    return await res.json();
  }
};