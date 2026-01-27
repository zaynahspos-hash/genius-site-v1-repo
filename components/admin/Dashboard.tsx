
import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { 
  DollarSign, ShoppingBag, Package, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight, Plus, Eye, Download, AlertTriangle, ArrowRight, BrainCircuit, Sparkles, Loader2, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { generateBusinessInsights } from '../../services/geminiService';

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<{ sales: any[], categories: any[] }>({ sales: [], categories: [] });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, chartData, orders, products, stock] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCharts('7days'),
          dashboardService.getRecentOrders(),
          dashboardService.getTopProducts(),
          dashboardService.getLowStock()
        ]);
        setStats(statsData);
        setCharts((chartData && typeof chartData === 'object' && 'categories' in chartData) ? chartData : { sales: [], categories: [] });
        setRecentOrders(orders);
        setTopProducts(products);
        setLowStock(stock);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleGetAiInsights = async () => {
    setAiLoading(true);
    try {
      const insights = await generateBusinessInsights({ stats, charts, lowStock });
      setAiInsights(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
  );

  const StatCard = ({ title, value, trend, icon: Icon, color, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 dark:bg-opacity-20`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {trend >= 0 ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
          {Math.abs(trend)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening with your store today.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
             <button 
                onClick={handleGetAiInsights}
                disabled={aiLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black dark:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50"
             >
                 {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />} 
                 AI Insights
             </button>
             <button 
                onClick={() => setActiveTab('products-add')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
             >
                 <Plus size={16} /> Add Product
             </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800 p-6 rounded-2xl animate-in slide-in-from-top-4 relative">
          <button onClick={() => setAiInsights(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles size={18} />
            </div>
            <h2 className="font-bold text-indigo-900 dark:text-indigo-200">AI Growth Strategy</h2>
          </div>
          <div className="prose prose-sm text-indigo-800 dark:text-indigo-200 max-w-none whitespace-pre-wrap">
            {aiInsights}
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.revenue?.value?.toLocaleString() || '0'}`} 
          trend={stats?.revenue?.trend || 0}
          icon={DollarSign} 
          color="bg-green-500 text-green-600"
          onClick={() => setActiveTab('reports')}
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.orders?.value || 0} 
          trend={stats?.orders?.trend || 0}
          icon={ShoppingBag} 
          color="bg-blue-500 text-blue-600"
          onClick={() => setActiveTab('orders')}
        />
        <StatCard 
          title="Total Customers" 
          value={stats?.customers?.value || 0} 
          trend={stats?.customers?.trend || 0}
          icon={Users} 
          color="bg-purple-500 text-purple-600"
          onClick={() => setActiveTab('customers')}
        />
        <StatCard 
          title="Total Products" 
          value={stats?.products?.value || 0} 
          trend={0}
          icon={Package} 
          color="bg-orange-500 text-orange-600"
          onClick={() => setActiveTab('products')}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales Analytics</h3>
            <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs rounded-lg p-2 outline-none dark:text-gray-200">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={charts?.sales || []}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}
                formatter={(value: number) => [`$${value}`, 'Sales']}
              />
              <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Orders Volume</h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={charts?.sales || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-700" />
                    <XAxis dataKey="date" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{fill: '#f3f4f6'}}
                    />
                    <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[350px]">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Revenue by Category</h3>
             <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={charts?.categories || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {(charts?.categories || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                 </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Selling Products</h3>
                <button onClick={() => setActiveTab('products')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    View All <ArrowRight size={14} />
                </button>
            </div>
            <div className="space-y-5">
                {topProducts.map((product, i) => (
                    <div key={i} className="flex items-center gap-4 group text-gray-900 dark:text-gray-200">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600">
                             <img src={product.images?.[0] || 'https://via.placeholder.com/50'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{product.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.salesCount} sold this month</p>
                        </div>
                        <div className="text-right">
                             <div className="text-sm font-bold text-gray-900 dark:text-white">${product.price}</div>
                             <div className="text-xs text-green-600 font-medium">In Stock</div>
                        </div>
                    </div>
                ))}
                {topProducts.length === 0 && <p className="text-gray-500 text-sm">No sales data yet.</p>}
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden text-gray-900 dark:text-gray-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-300 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Order</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">#{order.orderNumber}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize 
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-200">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <AlertTriangle size={20} className="text-amber-500" />
                 Low Stock Alert
             </h3>
             <div className="space-y-4">
                 {lowStock.map(product => (
                     <div key={product._id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                         <div className="flex items-center gap-3 overflow-hidden">
                             <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded overflow-hidden shrink-0">
                                 <img src={product.images?.[0]} className="w-full h-full object-cover" />
                             </div>
                             <div className="truncate">
                                 <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{product.title}</h4>
                                 <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">{product.stock} units left</p>
                             </div>
                         </div>
                         <button className="text-xs bg-white dark:bg-gray-700 border border-amber-200 dark:border-gray-600 text-amber-700 dark:text-amber-400 px-2 py-1 rounded hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors">
                             Restock
                         </button>
                     </div>
                 ))}
                 {lowStock.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                         <Package size={24} className="mb-2 opacity-50"/>
                         <p className="text-sm">All products in stock</p>
                     </div>
                 )}
             </div>
          </div>
      </div>
    </div>
  );
};
