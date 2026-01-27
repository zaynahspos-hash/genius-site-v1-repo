
import React from 'react';
import { useStore } from '../../App';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { cart, addToCart, clearCart, removeFromCart } = useStore();
  const navigate = useNavigate();

  const updateQty = (item: any, delta: number) => {
      // Assuming addToCart increments. To decrement, we usually need specific logic or just remove/re-add.
      // For this implementation, we use addToCart for +1.
      // We rely on the user to use the 'Remove' button or we'd implement a specific 'updateQuantity' in context.
      if (delta > 0) addToCart(item);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
              <ShoppingBag size={64} className="text-gray-200 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
              <p className="text-gray-500 mb-8 text-center max-w-xs">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Continue Shopping
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-6 items-center">
                                
                                {/* Product Info */}
                                <div className="col-span-6 w-full flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                                        <img src={item.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{item.selectedVariant?.name}</p>
                                        
                                        {/* Mobile Price Display */}
                                        <div className="md:hidden mt-2 font-medium text-gray-900">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Price (Desktop) */}
                                <div className="col-span-2 text-center font-medium text-gray-900 hidden md:block">
                                    ${item.price.toFixed(2)}
                                </div>

                                {/* Controls (Mobile: Row, Desktop: Center) */}
                                <div className="col-span-2 flex justify-between w-full md:justify-center items-center">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQty(item, 1)} className="px-3 py-2 text-gray-500 hover:bg-gray-50 border-l border-gray-200">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => removeFromCart(item.id, item.selectedVariant?.sku)}
                                        className="text-red-500 p-2 hover:bg-red-50 rounded-lg md:hidden"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Total & Remove (Desktop) */}
                                <div className="col-span-2 text-right hidden md:block">
                                    <div className="font-bold text-indigo-600 mb-1">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id, item.selectedVariant?.sku)}
                                        className="text-gray-400 hover:text-red-500 text-xs font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                        <Trash2 size={14} /> Clear Cart
                    </button>
                    <button onClick={() => navigate('/shop')} className="text-sm font-medium text-indigo-600 hover:underline w-full sm:w-auto text-center">
                        Continue Shopping
                    </button>
                </div>
            </div>

            <div className="lg:w-96 w-full">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 text-sm mb-8">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-bold text-gray-900">
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        Checkout <ArrowRight size={18} />
                    </button>
                    
                    <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-2">
                        Secure Checkout
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
