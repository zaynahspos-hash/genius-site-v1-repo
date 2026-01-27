import React, { useRef, useState } from 'react';
import { Order } from '../../types';
import { X, Printer, MapPin, Mail, CreditCard, Package, Clock, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { orderService } from '../../services/orderService';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdate: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [showRefund, setShowRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order.total);
  const [refundReason, setRefundReason] = useState('');
  const [restock, setRestock] = useState(true);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await orderService.updateStatus(order._id || order.id, newStatus);
      onUpdate();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
      if(!note.trim()) return;
      try {
          await orderService.addNote(order._id || order.id, note);
          setNote('');
          onUpdate();
      } catch (err) { alert('Failed to add note'); }
  };

  const handleRefund = async () => {
      if(confirm(`Refund $${refundAmount}?`)) {
          try {
              await orderService.refundOrder(order._id || order.id, refundAmount, refundReason, restock);
              setShowRefund(false);
              onUpdate();
          } catch(e) { alert('Refund failed'); }
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col print:shadow-none print:max-h-full print:w-full print:max-w-none">
        
        {/* Actions Header (Hidden on Print) */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 print:hidden">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'cancelled' || order.status === 'refunded' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowRefund(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100"
            >
              <RotateCcw size={16} />
              Refund
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Printer size={16} />
              Print
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-8 space-y-8 border-r border-gray-100">
                {/* Order Summary */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900">{item.productTitle}</div>
                                            <div className="text-xs text-gray-500">{item.variantName || item.variantSku}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                                        <td className="px-4 py-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4 space-y-2 text-sm">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>${(order.subtotal || order.total).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Discount</span><span>-${(order.discount || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>${(order.shippingFee || 0).toFixed(2)}</span></div>
                            {order.paymentFee && <div className="flex justify-between"><span>Payment Fee</span><span>${order.paymentFee.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
                    <div className="space-y-6 border-l-2 border-gray-100 ml-3 pl-6 relative">
                        {/* Note Input */}
                        <div className="relative mb-8">
                            <div className="absolute -left-[33px] top-0 w-3 h-3 bg-gray-300 rounded-full ring-4 ring-white"></div>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm" 
                                    placeholder="Leave a note..." 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                                <button onClick={handleAddNote} className="bg-gray-900 text-white px-3 rounded-lg"><Send size={16}/></button>
                            </div>
                        </div>

                        {(order.timeline || []).slice().reverse().map((event: any, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[33px] top-1.5 w-3 h-3 bg-indigo-600 rounded-full ring-4 ring-white"></div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900 text-sm">{event.status}</span>
                                    <span className="text-gray-500 text-xs mt-0.5">{event.note}</span>
                                    <span className="text-gray-400 text-xs mt-1">{new Date(event.date).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="w-full lg:w-80 bg-gray-50 p-8 space-y-8">
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Customer</h4>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5"><Mail size={16} className="text-gray-400"/></div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-sm text-gray-500 break-all">{order.guestEmail}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Info</h4>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5"><CreditCard size={16} className="text-gray-400"/></div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-500 capitalize">{order.paymentStatus}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h4>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5"><MapPin size={16} className="text-gray-400"/></div>
                        <div>
                            {order.shippingAddress ? (
                                <p className="text-sm text-gray-600">
                                    {order.shippingAddress.street}<br/>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br/>
                                    {order.shippingAddress.country}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">No address provided</p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status Update</h4>
                    <div className="space-y-2">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                disabled={updating || order.status === status}
                                onClick={() => handleStatusChange(status)}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium capitalize text-left flex items-center justify-between
                                    ${order.status === status 
                                        ? 'bg-indigo-600 text-white shadow-sm' 
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                            >
                                {status}
                                {order.status === status && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Refund Modal */}
        {showRefund && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                    <h3 className="text-lg font-bold mb-4">Process Refund</h3>
                    <p className="text-sm text-gray-600 mb-4">Refunds will be processed via original payment method when possible.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input type="number" max={order.total} className="w-full border rounded px-3 py-2" value={refundAmount} onChange={e => setRefundAmount(Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Reason</label>
                            <input className="w-full border rounded px-3 py-2" placeholder="e.g. Customer Return" value={refundReason} onChange={e => setRefundReason(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={restock} onChange={e => setRestock(e.target.checked)} />
                            <label className="text-sm">Restock Items</label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setShowRefund(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancel</button>
                            <button onClick={handleRefund} className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">Confirm Refund</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};