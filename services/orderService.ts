import { Order } from '../types';
import { db } from './dbService';
import { API_BASE_URL, getAuthHeader } from './apiConfig';

const API_URL = `${API_BASE_URL}/orders`;

export const orderService = {
  async createOrder(orderData: any) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader('admin'), // Fallback admin, but checkout usually public or customer. Logic handled in backend.
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Order failed');
      }
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, creating mock order locally.');
      throw error;
    }
  },

  async getOrders(page = 1, status = 'all', search = '') {
    try {
      const queryParams = new URLSearchParams({
        pageNumber: page.toString(),
        status: status !== 'all' ? status : '',
        search
      });

      const res = await fetch(`${API_URL}?${queryParams}`, {
        headers: getAuthHeader('admin'),
      });
      
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, falling back to local orders.');
      let orders = db.getOrders();

      if (status !== 'all') {
        orders = orders.filter(o => o.status === status);
      }
      
      if (search) {
        const lowerSearch = search.toLowerCase();
        orders = orders.filter(o => 
          o.orderNumber.toLowerCase().includes(lowerSearch) || 
          o.customerName.toLowerCase().includes(lowerSearch)
        );
      }

      const pageSize = 10;
      return {
        orders: orders.slice((page - 1) * pageSize, page * pageSize),
        page,
        pages: Math.ceil(orders.length / pageSize),
        count: orders.length
      };
    }
  },

  async getOrderById(id: string) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeader('admin'),
      });
      if (!res.ok) throw new Error('Failed to fetch order details');
      return await res.json();
    } catch (error) {
      const order = db.getOrders().find(o => o.id === id || o._id === id);
      if (!order) throw new Error('Order not found locally');
      return order;
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader('admin'),
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, updating status locally.');
      const orders = db.getOrders();
      const order = orders.find(o => o.id === id || o._id === id);
      if (order) {
        order.status = status as any; 
        return order;
      }
      throw error;
    }
  },

  async addNote(id: string, note: string) {
      const res = await fetch(`${API_URL}/${id}/note`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ note })
      });
      if(!res.ok) throw new Error('Failed to add note');
      return await res.json();
  },

  async refundOrder(id: string, amount: number, reason: string, restock: boolean) {
      const res = await fetch(`${API_URL}/${id}/refund`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader('admin') },
          body: JSON.stringify({ amount, reason, restock })
      });
      if (!res.ok) throw new Error('Refund failed');
      return await res.json();
  }
};