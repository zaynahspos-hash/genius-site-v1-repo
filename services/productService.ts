import { Product } from '../types';
import { db } from './dbService';
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

    try {
      const res = await fetch(`${API_URL}?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, falling back to local data.');
      // Simple local mock filtering for demo fallback
      let filtered = db.getProducts();
      if(params.search) filtered = filtered.filter(p => p.title.toLowerCase().includes(params.search!.toLowerCase()));
      if(params.status && params.status !== 'all') filtered = filtered.filter(p => p.status === params.status);
      
      const pageSize = params.limit || 10;
      const page = params.page || 1;
      const start = (page - 1) * pageSize;
      
      return {
        products: filtered.slice(start, start + pageSize),
        page,
        pages: Math.ceil(filtered.length / pageSize),
        count: filtered.length
      };
    }
  },

  async getProduct(id: string) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    } catch (error) {
      const product = db.getProducts().find(p => p.id === id);
      if (!product) throw new Error('Product not found in local db');
      return product;
    }
  },

  async createProduct(product: Partial<Product>) {
    try {
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
    } catch (error) {
      console.warn('Backend API unreachable, saving locally.');
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      } as Product;
      db.saveProduct(newProduct);
      return newProduct;
    }
  },

  async updateProduct(id: string, product: Partial<Product>) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader('admin'),
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, updating locally.');
      const existing = db.getProducts().find(p => p.id === id);
      if (existing) {
        const updated = { ...existing, ...product };
        db.saveProduct(updated);
        return updated;
      }
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader('admin') },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return await res.json();
    } catch (error) {
      db.deleteProduct(id);
      return { message: 'Product removed locally' };
    }
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
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData, 
      });

      if (!res.ok) throw new Error('Image upload failed');
      return await res.json(); 
    } catch (error) {
      return URL.createObjectURL(file); // Mock fallback
    }
  }
};