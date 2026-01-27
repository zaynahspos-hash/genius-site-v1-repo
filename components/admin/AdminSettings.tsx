
import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../../types';
import { settingsService } from '../../services/settingsService';
import { useNavigate } from 'react-router-dom';
import { 
    Save, Loader2, Store, CreditCard, Truck, Receipt, Palette, Mail, 
    Layout, RefreshCw, DollarSign, Shield, Power, Download, ExternalLink, Menu, Send, AlertCircle
} from 'lucide-react';

interface AdminSettingsProps {
    initialTab?: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ initialTab }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'general');
  const [hasChanges, setHasChanges] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
      if (initialTab) {
          setActiveTab(initialTab === 'settings' ? 'general' : initialTab);
      }
  }, [initialTab]);

  const loadSettings = async () => {
      try {
          const data = await settingsService.getSettings();
          setSettings(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const saveChanges = async () => {
      if(!settings) return;
      setSaving(true);
      try {
          await settingsService.updateSettings(settings);
          setHasChanges(false);
          if (settings.theme?.colors?.primary) {
              document.documentElement.style.setProperty('--primary-color', settings.theme.colors.primary);
          }
          alert('Settings saved successfully');
      } catch (err) { alert('Save failed'); } finally { setSaving(false); }
  };

  const sendTestEmail = async () => {
      if (!settings?.general?.storeEmail) return alert('Save store email first');
      setTestEmailSending(true);
      try {
          await settingsService.sendTestEmail(settings.general.storeEmail);
          alert(`Test email sent to ${settings.general.storeEmail}`);
      } catch (e) { alert('Failed to send test email. Check SMTP settings.'); }
      finally { setTestEmailSending(false); }
  };

  // Helper for shallow updates (e.g. general.storeName)
  const handleUpdate = (section: keyof StoreSettings, data: any) => {
      if (!settings) return;
      setSettings({ ...settings, [section]: { ...settings[section], ...data } });
      setHasChanges(true);
  };

  // Helper for deep updates (e.g. payment.stripe.enabled)
  const handleDeepUpdate = (section: keyof StoreSettings, subsection: string, data: any) => {
      if (!settings) return;
      setSettings({
          ...settings,
          [section]: {
              ...settings[section],
              [subsection]: {
                  ...(settings[section] as any)[subsection],
                  ...data
              }
          }
      });
      setHasChanges(true);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gray-400" size={32}/></div>;
  if (!settings) return <div className="p-20 text-center">Failed to load settings.</div>;

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'theme', label: 'Theme & Layout', icon: Palette },
    { id: 'homepage', label: 'Homepage', icon: Layout },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'tax', label: 'Tax & Checkout', icon: Receipt },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'system', label: 'System & Security', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sticky top-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur z-10 py-4 border-b border-gray-200 dark:border-gray-700 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Store Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your store preferences</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={() => loadSettings()} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" title="Reset">
                <RefreshCw size={20} />
            </button>
            <button 
                onClick={saveChanges}
                disabled={!hasChanges && !saving}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all shadow-md
                    ${hasChanges ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
                {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                {hasChanges ? 'Save Changes' : 'Saved'}
            </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="md:hidden mb-4">
               <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-medium text-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
               >
                   {tabs.map(tab => (
                       <option key={tab.id} value={tab.id}>{tab.label}</option>
                   ))}
               </select>
           </div>

           <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-40">
               {tabs.map(tab => (
                   <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4
                           ${activeTab === tab.id 
                               ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                               : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                   >
                       <tab.icon size={18} />
                       {tab.label}
                   </button>
               ))}
           </div>
        </div>

        <div className="flex-1 space-y-6">
            {activeTab === 'general' && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold mb-4 dark:text-white">Store Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Store Name</label>
                              <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.general.storeName} onChange={e => handleUpdate('general', { storeName: e.target.value })} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Store Email</label>
                              <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.general.storeEmail} onChange={e => handleUpdate('general', { storeEmail: e.target.value })} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Currency</label>
                              <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.general.currency} onChange={e => handleUpdate('general', { currency: e.target.value })} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Timezone</label>
                              <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.general.timezone} onChange={e => handleUpdate('general', { timezone: e.target.value })} />
                          </div>
                      </div>
                  </div>
            )}
            
            {activeTab === 'theme' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Colors & Typography</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Primary Color</label>
                            <div className="flex gap-2">
                                <input type="color" className="h-10 w-10 border rounded p-0 cursor-pointer" value={settings.theme.colors.primary} onChange={e => handleDeepUpdate('theme', 'colors', { primary: e.target.value })} />
                                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.theme.colors.primary} onChange={e => handleDeepUpdate('theme', 'colors', { primary: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Secondary Color</label>
                            <div className="flex gap-2">
                                <input type="color" className="h-10 w-10 border rounded p-0 cursor-pointer" value={settings.theme.colors.secondary || '#ffffff'} onChange={e => handleDeepUpdate('theme', 'colors', { secondary: e.target.value })} />
                                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.theme.colors.secondary || '#ffffff'} onChange={e => handleDeepUpdate('theme', 'colors', { secondary: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Heading Font</label>
                            <select className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.theme.typography.headingFont} onChange={e => handleDeepUpdate('theme', 'typography', { headingFont: e.target.value })}>
                                <option value="Poppins">Poppins</option>
                                <option value="Inter">Inter</option>
                                <option value="serif">Serif</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Products Per Row</label>
                            <select className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.theme.layout.productsPerRow} onChange={e => handleDeepUpdate('theme', 'layout', { productsPerRow: Number(e.target.value) })}>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'shipping' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2"><Truck size={20}/> Shipping Rules</h3>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Standard Shipping Rate ($)</label>
                            <input type="number" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.shipping.standardRate} onChange={e => handleUpdate('shipping', { standardRate: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Free Shipping Threshold ($)</label>
                            <input type="number" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.shipping.freeShippingThreshold} onChange={e => handleUpdate('shipping', { freeShippingThreshold: Number(e.target.value) })} />
                            <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping.</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payment' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                    <h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><CreditCard size={20}/> Payment Gateways</h3>
                    
                    {/* Stripe */}
                    <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 dark:text-white">Stripe</h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.payment.stripe.enabled} onChange={e => handleDeepUpdate('payment', 'stripe', { enabled: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        {settings.payment.stripe.enabled && (
                            <div className="space-y-3">
                                <input type="text" placeholder="Publishable Key" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" value={settings.payment.stripe.publicKey || ''} onChange={e => handleDeepUpdate('payment', 'stripe', { publicKey: e.target.value })} />
                                <input type="password" placeholder="Secret Key" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" value={settings.payment.stripe.secretKey || ''} onChange={e => handleDeepUpdate('payment', 'stripe', { secretKey: e.target.value })} />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={settings.payment.stripe.testMode} onChange={e => handleDeepUpdate('payment', 'stripe', { testMode: e.target.checked })} />
                                    <label className="text-sm text-gray-600 dark:text-gray-300">Test Mode</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COD */}
                    <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 dark:text-white">Cash on Delivery</h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.payment.cod.enabled} onChange={e => handleDeepUpdate('payment', 'cod', { enabled: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        {settings.payment.cod.enabled && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Additional Fee ($)</label>
                                <input type="number" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.payment.cod.additionalFee} onChange={e => handleDeepUpdate('payment', 'cod', { additionalFee: Number(e.target.value) })} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'tax' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2"><Receipt size={20}/> Tax Configuration</h3>
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Enable Taxes</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.tax.enabled} onChange={e => handleUpdate('tax', { enabled: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        {settings.tax.enabled && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Global Tax Rate (0-1)</label>
                                    <input type="number" step="0.01" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.tax.rate} onChange={e => handleUpdate('tax', { rate: Number(e.target.value) })} />
                                    <p className="text-xs text-gray-500 mt-1">Example: 0.08 for 8% tax.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={settings.tax.includeInPrice} onChange={e => handleUpdate('tax', { includeInPrice: e.target.checked })} />
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Prices already include tax</label>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'email' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><Mail size={20}/> SMTP Settings</h3>
                        <button onClick={sendTestEmail} disabled={testEmailSending} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-indigo-100">
                            {testEmailSending ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>} Test
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">SMTP Host</label>
                            <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.smtpHost} onChange={e => handleUpdate('email', { smtpHost: e.target.value })} placeholder="smtp.gmail.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">SMTP Port</label>
                            <input type="number" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.smtpPort} onChange={e => handleUpdate('email', { smtpPort: Number(e.target.value) })} placeholder="587" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">SMTP User</label>
                            <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.smtpUser} onChange={e => handleUpdate('email', { smtpUser: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">SMTP Password</label>
                            <input type="password" className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.smtpPass} onChange={e => handleUpdate('email', { smtpPass: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">From Name</label>
                            <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.fromName} onChange={e => handleUpdate('email', { fromName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">From Email</label>
                            <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={settings.email.fromEmail} onChange={e => handleUpdate('email', { fromEmail: e.target.value })} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'homepage' && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <Layout size={48} className="mx-auto text-indigo-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Homepage Customizer</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Use the visual editor to arrange sections and manage content.</p>
                    <button onClick={() => navigate('/admin/customizer')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 inline-flex items-center gap-2">
                        <ExternalLink size={18} /> Open Visual Editor
                    </button>
                </div>
            )}

            {activeTab === 'system' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2"><Shield size={20}/> Security & Maintenance</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Maintenance Mode</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Show a maintenance page to visitors.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings.maintenance?.enabled || false} onChange={e => handleUpdate('maintenance', { enabled: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        {settings.maintenance?.enabled && (
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Maintenance Message</label>
                                <textarea className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={settings.maintenance?.message} onChange={e => handleUpdate('maintenance', { message: e.target.value })} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
