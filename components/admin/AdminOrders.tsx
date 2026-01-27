
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { orderService } from '../../services/orderService';
import { OrderDetail } from './OrderDetail';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, PackageOpen, CreditCard, Calendar } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filtering and pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(page, statusFilter, search);
      setOrders(data.orders);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchOrders();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, statusFilter, search]);

  const handleStatusUpdate = () => {
    // Refresh list when details update an order
    fetchOrders();
    // Also update selected order if needed, but better to just fetch fresh data or close modal
    if(selectedOrder) {
        orderService.getOrderById(selectedOrder._id || selectedOrder.id).then(setSelectedOrder);
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
          case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
          default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
             {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                 <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors flex-shrink-0
                        ${statusFilter === status 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                 >
                     {status}
                 </button>
             ))}
          </div>

          <div className="relative w-full xl:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400"/>
              </div>
              <input 
                type="text"
                placeholder="Search order # or customer..." 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

      {/* Content Area */}
      {loading ? (
             <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">Loading orders...</div>
         ) : orders.length === 0 ? (
             <div className="p-12 text-center flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                 <PackageOpen size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                 <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
             </div>
         ) : (
            <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id || order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                                        #{order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {order.customerName}
                                        <div className="text-xs text-gray-400 font-normal">{order.guestEmail || (order.user as any)?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded capitalize">
                                            {order.paymentStatus || 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
                {orders.map(order => (
                    <div 
                        key={order.id || order._id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.99] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">#{order.orderNumber}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                    <Calendar size={12} />
                                    {new Date(order.date || order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{order.items.length} Items</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{order.paymentStatus || 'Unpaid'}</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <CreditCard size={14} />
                                <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'Card'}</span>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                View Details <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-gray-300"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-gray-300"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
            </>
         )}

      {selectedOrder && (
          <OrderDetail 
             order={selectedOrder} 
             onClose={() => setSelectedOrder(null)} 
             onUpdate={handleStatusUpdate}
          />
      )}
    </div>
  );
};
