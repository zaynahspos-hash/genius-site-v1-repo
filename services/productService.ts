import { Product } from '../types';
import { API_BASE_URL, getAuthHeader } from './apiConfig';

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

    const res = await fetch(`${API_URL}?${query.toString()}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch products');
    }
    return await res.json();
  },

  async getProduct(idOrSlug: string) {
    const res = await fetch(`${API_URL}/${idOrSlug}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Product not found');
    }
    return await res.json();
  },

  async createProduct(product: Partial<Product>) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('admin'),
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create product');
    }
    return await res.json();
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('admin'),
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update product');
    }
    return await res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader('admin') },
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete product');
    }
    return await res.json();
  },

  async bulkDelete(ids: string[]) {
      const res = await fetch(`${API_URL}/bulk-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ ids })
      });
      if(!res.ok) throw new Error('Bulk delete failed');
      return await res.json();
  },

  async bulkStatus(ids: string[], status: string) {
      const res = await fetch(`${API_URL}/bulk-status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ ids, status })
      });
      if(!res.ok) throw new Error('Bulk status update failed');
      return await res.json();
  },

  async duplicateProduct(id: string) {
      const res = await fetch(`${API_URL}/${id}/duplicate`, {
          method: 'POST',
          headers: { ...getAuthHeader('admin') }
      });
      if(!res.ok) throw new Error('Duplication failed');
      return await res.json();
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: { ...getAuthHeader('admin') },
      body: formData, 
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Image upload failed');
    }
    const data = await res.json();
    return data.url || data.imageUrl; // Support various backend formats
  }
};
