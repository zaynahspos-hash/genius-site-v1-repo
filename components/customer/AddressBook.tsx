import React, { useEffect, useState } from 'react';
import { customerService } from '../../services/customerService';
import { Plus, Trash2, MapPin } from 'lucide-react';

export const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
      street: '', city: '', state: '', zip: '', country: 'US'
  });

  useEffect(() => {
    customerService.getProfile().then(user => {
        setAddresses(user.addresses || []);
        setLoading(false);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const updated = await customerService.addAddress(newAddress as any);
        setAddresses(updated);
        setShowForm(false);
        setNewAddress({ street: '', city: '', state: '', zip: '', country: 'US' });
    } catch (err) {
        alert('Failed to add address');
    }
  };

  const handleDelete = async (id: string) => {
      if(confirm('Delete this address?')) {
          const updated = await customerService.removeAddress(id);
          setAddresses(updated);
      }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
                <Plus size={16} /> Add Address
            </button>
        </div>

        {showForm && (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-4">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Street Address" className="border p-2 rounded w-full col-span-2" 
                            value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                        <input required placeholder="City" className="border p-2 rounded w-full" 
                            value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                        <input required placeholder="State" className="border p-2 rounded w-full" 
                            value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                        <input required placeholder="ZIP Code" className="border p-2 rounded w-full" 
                            value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                        <input required placeholder="Country" className="border p-2 rounded w-full" 
                            value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
                <div key={addr._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="text-gray-500" size={20} /></div>
                        <div>
                            <p className="text-gray-900 font-medium">{addr.street}</p>
                            <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                            <p className="text-gray-500 text-sm">{addr.country}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleDelete(addr._id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};