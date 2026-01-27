import React, { useEffect, useState } from 'react';
import { customerService } from '../../services/customerService';
import { User, Package, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    customerService.getProfile().then(setProfile);
    customerService.getOrders().then(data => setOrders(data.slice(0, 3))); // Get top 3
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Package size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <MapPin size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{profile.addresses?.length || 0}</h3>
                    <p className="text-gray-500 text-sm">Saved Addresses</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-lg">
                    <Heart size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{profile.wishlist?.length || 0}</h3>
                    <p className="text-gray-500 text-sm">Wishlist Items</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button onClick={() => navigate('/account/orders')} className="text-sm text-indigo-600 font-medium">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No orders placed yet.</div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="font-medium text-gray-900">Order #{order.orderNumber}</div>
                                <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                                <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
                <p><span className="font-medium text-gray-900">Name:</span> {profile.name}</p>
                <p><span className="font-medium text-gray-900">Email:</span> {profile.email}</p>
                <button onClick={() => navigate('/account/settings')} className="text-indigo-600 font-medium mt-2">Edit Profile</button>
            </div>
        </div>
    </div>
  );
};