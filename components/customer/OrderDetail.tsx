
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { ArrowLeft, Package, MapPin, CreditCard, RotateCcw, Truck } from 'lucide-react';
import { useStore } from '../../App'; // to add to cart

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();

  useEffect(() => {
    if (id) {
        orderService.getOrderById(id).then(setOrder).finally(() => setLoading(false));
    }
  }, [id]);

  const handleReorder = () => {
      if(!order) return;
      order.items.forEach((item: any) => {
          // Reconstruct product object enough for cart
          addToCart({
              id: item.product,
              title: item.productTitle,
              price: item.price,
              images: [item.image || 'https://via.placeholder.com/150'], // Fallback
              selectedVariant: item.variantSku ? { sku: item.variantSku, name: item.variantName, price: item.price } : undefined
          } as any);
      });
      alert('Items added to cart!');
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => navigate('/account/orders')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft size={20} className="mr-1"/> Back to Orders
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                        <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="self-start sm:self-auto text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-900 bg-gray-50/50">Items Ordered</div>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 sm:p-6 flex gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                    <img src={item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">{item.productTitle}</h4>
                                    <p className="text-sm text-gray-500">{item.variantName || item.variantSku}</p>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                    </div>
                                    {!item.isReviewed && order.status === 'delivered' && (
                                        <button onClick={() => navigate(`/product/${item.product}#reviews`)} className="text-xs text-indigo-600 font-medium mt-2 hover:underline">
                                            Write Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracking if available (simulated) */}
                {order.status === 'shipped' && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Truck size={24} /></div>
                            <div>
                                <h4 className="font-bold text-blue-900">Shipment on the way</h4>
                                <p className="text-sm text-blue-700">Estimated delivery: 3-5 days</p>
                            </div>
                        </div>
                        <button className="sm:ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-full sm:w-auto">Track Package</button>
                    </div>
                )}
            </div>

            <div className="lg:w-80 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${(order.subtotal || order.total).toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${(order.shippingFee || 0).toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t mt-2 text-gray-900"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleReorder} className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-black font-medium transition-colors">
                        <RotateCcw size={16} /> Reorder All
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Shipping Address</h3>
                    {order.shippingAddress ? (
                        <div className="flex gap-3 text-sm text-gray-600">
                            <MapPin size={18} className="shrink-0 text-gray-400" />
                            <div>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    ) : <p className="text-sm text-gray-500">Digital / No Address</p>}
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Payment</h3>
                    <div className="flex gap-3 text-sm text-gray-600">
                        <CreditCard size={18} className="shrink-0 text-gray-400" />
                        <div>
                            <p className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">Securely processed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
