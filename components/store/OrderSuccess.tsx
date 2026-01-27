import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../../types';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        orderService.getOrderById(id).then(data => {
            setOrder(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-green-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-green-100">Thank you for your purchase.</p>
          </div>

          {order ? (
              <div className="p-8">
                  <div className="text-center mb-8">
                      <p className="text-gray-500 text-sm">Order Number</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">#{order.orderNumber}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Details</h3>
                      <div className="space-y-3">
                          {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.quantity}x {item.productTitle}</span>
                                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                          ))}
                          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-gray-900">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <Package className="text-gray-400 mt-1" size={20} />
                          <div>
                              <h4 className="font-medium text-gray-900">Estimated Delivery</h4>
                              <p className="text-sm text-gray-500">3-5 Business Days</p>
                          </div>
                      </div>
                      <p className="text-sm text-gray-500 text-center px-4">
                          We've sent a confirmation email to <span className="font-medium text-gray-900">{order.guestEmail}</span>
                      </p>
                  </div>

                  <div className="mt-8 flex gap-3">
                      <button 
                        onClick={() => window.print()}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                          <Printer size={16} /> Print Receipt
                      </button>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="flex-1 py-3 px-4 bg-gray-900 rounded-lg text-sm font-medium text-white hover:bg-black flex items-center justify-center gap-2"
                      >
                          Continue Shopping <ArrowRight size={16} />
                      </button>
                  </div>
              </div>
          ) : (
              <div className="p-8 text-center text-red-500">Could not load order details.</div>
          )}
      </div>
    </div>
  );
};