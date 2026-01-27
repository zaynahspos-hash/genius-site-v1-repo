import React, { useState, useEffect } from 'react';
import { reportService } from '../../../services/reportService';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, ArrowUpRight, TrendingUp, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState<any>(null);
  const [ordersData, setOrdersData] = useState<any>(null);
  const [customersData, setCustomersData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, [period]);

  const fetchAll = async () => {
      setLoading(true);
      try {
          const [sales, orders, cust, inv, bd] = await Promise.all([
              reportService.getSales(period),
              reportService.getOrders(),
              reportService.getCustomers(),
              reportService.getInventory(),
              reportService.getBreakdown()
          ]);
          setSalesData(sales);
          setOrdersData(orders);
          setCustomersData(cust);
          setInventoryData(inv);
          setBreakdown(bd);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  const handleExport = async (type: string) => {
      try {
          const csv = await reportService.exportData(type);
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${type}_report.csv`;
          a.click();
      } catch(e) { alert('Export failed'); }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading analytics...</div>;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-500 mt-1">Deep dive into your store performance</p>
            </div>
            <div className="flex gap-2">
                <select value={period} onChange={e => setPeriod(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 3 Months</option>
                    <option value="1y">Last Year</option>
                </select>
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                        <Download size={16} /> Export
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-xl p-2 hidden group-hover:block z-10">
                        <button onClick={() => handleExport('orders')} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">Export Orders</button>
                        <button onClick={() => handleExport('products')} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">Export Products</button>
                        <button onClick={() => handleExport('customers')} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">Export Customers</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
            {['sales', 'orders', 'customers', 'inventory'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* --- SALES VIEW --- */}
        {activeTab === 'sales' && salesData && (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20}/></div>
                            <span className="text-gray-500 text-sm">Total Revenue</span>
                        </div>
                        <h3 className="text-2xl font-bold">${salesData.summary.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={20}/></div>
                            <span className="text-gray-500 text-sm">Total Orders</span>
                        </div>
                        <h3 className="text-2xl font-bold">{salesData.summary.totalOrders}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={20}/></div>
                            <span className="text-gray-500 text-sm">Avg. Order Value</span>
                        </div>
                        <h3 className="text-2xl font-bold">${salesData.summary.avgOrderValue.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Sales Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={salesData.chart}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Sales by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={breakdown?.byCategory} 
                                    dataKey="value" 
                                    nameKey="_id" 
                                    cx="50%" cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5}
                                >
                                    {breakdown?.byCategory.map((_: any, i: number) => (
                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {breakdown?.byCategory.map((cat: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                                        {cat._id}
                                    </span>
                                    <span className="font-medium">${cat.value.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ORDERS VIEW --- */}
        {activeTab === 'orders' && ordersData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ordersData.statusBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: 8}} />
                            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Additional Order stats could go here */}
            </div>
        )}

        {/* --- CUSTOMERS VIEW --- */}
        {activeTab === 'customers' && customersData && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Top Spending Customers</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customersData.topCustomers.map((c: any) => (
                                    <tr key={c._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{c.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.email}</td>
                                        <td className="px-6 py-4">{c.totalOrders}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">${c.totalSpent.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Customer Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={customersData.growth}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="_id" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{borderRadius: 8}} />
                            <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* --- INVENTORY VIEW --- */}
        {activeTab === 'inventory' && inventoryData && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-gray-500 text-sm">Total Inventory Value</span>
                        <h3 className="text-2xl font-bold mt-1">${inventoryData.summary.totalValue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-gray-500 text-sm">Low Stock Items</span>
                        <h3 className="text-2xl font-bold mt-1 text-amber-600">{inventoryData.summary.lowStockCount}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-gray-500 text-sm">Out of Stock</span>
                        <h3 className="text-2xl font-bold mt-1 text-red-600">{inventoryData.summary.outOfStockCount}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 font-bold">Lowest Stock Items</div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventoryData.inventory.map((p: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{p.title}</td>
                                    <td className="px-6 py-4">{p.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                            ${p.status === 'Out' ? 'bg-red-100 text-red-700' : p.status === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};