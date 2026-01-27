
import React, { useEffect, useState } from 'react';
import { customerAdminService } from '../../services/customerAdminService';
import { Search, Eye, Mail, User as UserIcon } from 'lucide-react';
import { CustomerDetail } from './CustomerDetail';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    customerAdminService.getAll().then(setCustomers);
  }, []);

  const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedId) {
      return <CustomerDetail id={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search customers..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4">Total Spent</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filtered.map(customer => (
                            <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={() => setSelectedId(customer._id)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                                            {customer.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{customer.totalOrders}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${customer.totalSpent?.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Eye size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
            {filtered.map(customer => (
                <div 
                    key={customer._id} 
                    onClick={() => setSelectedId(customer._id)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 active:scale-[0.99] transition-transform"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg">
                                {customer.name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{customer.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Mail size={10} /> {customer.email}
                                </p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1">
                            <Eye size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Orders</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{customer.totalOrders}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Spent</p>
                            <p className="font-bold text-green-600 dark:text-green-400 text-lg">${customer.totalSpent?.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-right">
                        Joined {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>

        {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                No customers found.
            </div>
        )}
    </div>
  );
};
    