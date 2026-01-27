
import React, { useEffect, useState } from 'react';
import { customerService } from '../../services/customerService';
import { PackageOpen, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    customerService.getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
          case 'processing': return 'text-blue-600 bg-blue-50 border-blue-100';
          case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-100';
          case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
          default: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'delivered': return <CheckCircle size={14} />;
          case 'shipped': return <Truck size={14} />;
          case 'cancelled': return <XCircle size={14} />;
          default: return <Clock size={14} />;
      }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        
        {orders.length === 0 ? (
             <div className="bg-white p-12 rounded-xl border border-gray-100 text-center flex flex-col items-center">
                 <PackageOpen size={48} className="text-gray-300 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                 <p className="text-gray-500 mt-2">Go to the shop and place your first order.</p>
             </div>
        ) : (
            <div className="space-y-4">
                {orders.map(order => (
                    <div 
                        key={order._id} 
                        onClick={() => navigate(`/account/orders/${order._id || order.id}`)}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 sm:px-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
                            <div className="flex flex-col sm:flex-row sm:gap-6 text-sm">
                                <div>
                                    <span className="text-gray-500 mr-2">Placed:</span>
                                    <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="hidden sm:block text-gray-300">|</div>
                                <div>
                                    <span className="text-gray-500 mr-2">Order #:</span>
                                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                </span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="space-y-3 flex-1">
                                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                <img src={item.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1">{item.productTitle}</div>
                                                <div className="text-xs text-gray-500">Qty: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 2 && (
                                        <p className="text-xs text-gray-500 italic pl-16">+ {order.items.length - 2} more items</p>
                                    )}
                                </div>
                                
                                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
