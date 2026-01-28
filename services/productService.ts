import { Product } from '../types';
import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/products`;
const UPLOAD_URL = `${API_BASE_URL}/upload`;

interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
}

export const productService = {
  async getProducts(params: ProductQueryParams = {}) {
    const query = new URLSearchParams();
    if(params.page) query.append('page', params.page.toString());
    if(params.limit) query.append('limit', params.limit.toString());
    if(params.search) query.append('search', params.search);
    if(params.status) query.append('status', params.status);
    if(params.category) query.append('category', params.category);
    if(params.sort) query.append('sort', params.sort);

    const res = await safeFetch(`${API_URL}?${query.toString()}`);
    return await res.json();
  },

  async getProduct(idOrSlug: string) {
    const res = await safeFetch(`${API_URL}/${idOrSlug}`);
    return await res.json();
  },

  async createProduct(product: Partial<Product>) {
    const res = await safeFetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('admin'),
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('admin'),
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  },

  async deleteProduct(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader('admin') },
    });
    return await res.json();
  },

  async bulkDelete(ids: string[]) {
      const res = await safeFetch(`${API_URL}/bulk-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ ids })
      });
      return await res.json();
  },

  async bulkStatus(ids: string[], status: string) {
      const res = await safeFetch(`${API_URL}/bulk-status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ ids, status })
      });
      return await res.json();
  },

  async duplicateProduct(id: string) {
      const res = await safeFetch(`${API_URL}/${id}/duplicate`, {
          method: 'POST',
          headers: { ...getAuthHeader('admin') }
      });
      return await res.json();
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await safeFetch(UPLOAD_URL, {
      method: 'POST',
      headers: { ...getAuthHeader('admin') },
      body: formData, 
    });

    const data = await res.json();
    return data.url || data.imageUrl;
  }
};