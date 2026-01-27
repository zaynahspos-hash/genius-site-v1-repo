import React, { useEffect, useState } from 'react';
import { customerAdminService } from '../../services/customerAdminService';
import { ArrowLeft, Mail, MapPin, Package, Calendar } from 'lucide-react';

interface CustomerDetailProps {
    id: string;
    onBack: () => void;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ id, onBack }) => {
    const [customer, setCustomer] = useState<any>(null);

    useEffect(() => {
        customerAdminService.getById(id).then(setCustomer);
    }, [id]);

    if (!customer) return <div>Loading...</div>;

    return (
        <div className="animate-in slide-in-from-right duration-300">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft size={20} className="mr-1"/> Back to Customers
            </button>

            <div className="grid grid-cols-3 gap-6">
                {/* Sidebar Info */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                            {customer.name[0]}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">{customer.email}</p>
                        
                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                                <p className="font-bold text-gray-900">${customer.stats?.totalSpent?.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Orders</p>
                                <p className="font-bold text-gray-900">{customer.stats?.totalOrders}</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-black">
                            <Mail size={16} /> Send Email
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Default Address</h3>
                        {customer.addresses && customer.addresses.length > 0 ? (
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <MapPin size={18} className="mt-0.5 text-gray-400" />
                                <div>
                                    <p>{customer.addresses[0].street}</p>
                                    <p>{customer.addresses[0].city}, {customer.addresses[0].state} {customer.addresses[0].zip}</p>
                                    <p>{customer.addresses[0].country}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No addresses saved.</p>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Order History</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {customer.orders?.map((order: any) => (
                                <div key={order._id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-indigo-600">#{order.orderNumber}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize 
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Package size={12}/> {order.items.length} Items</span>
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-900">${order.total.toFixed(2)}</div>
                                </div>
                            ))}
                            {(!customer.orders || customer.orders.length === 0) && (
                                <div className="p-8 text-center text-gray-500">No orders yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};