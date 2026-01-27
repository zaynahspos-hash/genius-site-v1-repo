
import React, { useState, useEffect } from 'react';
import { useStore } from '../../App';
import { orderService } from '../../services/orderService';
import { giftCardService } from '../../services/giftCardService';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, ChevronLeft, Loader2, Landmark, DollarSign, Copy, Gift } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { storeService } from '../../services/storeService';

export const Checkout: React.FC = () => {
  const { cart, clearCart } = useStore();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<{ code: string; balance: number } | null>(null);

  // Payment Simulators
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
      // Set default payment method based on active settings
      if(settings?.payment?.stripe?.enabled) setPaymentMethod('card');
      else if (settings?.payment?.cod?.enabled) setPaymentMethod('cod');
      else if (settings?.payment?.bankTransfer?.enabled) setPaymentMethod('bank_transfer');
  }, [settings]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > (settings?.shipping?.freeShippingThreshold || 1000) ? 0 : (settings?.shipping?.standardRate || 0);
  const tax = settings?.tax?.enabled ? (subtotal - (appliedCoupon?.discount || 0)) * settings.tax.rate : 0;
  
  const paymentFee = (paymentMethod === 'cod' && settings?.payment?.cod?.enabled) 
        ? settings.payment.cod.additionalFee 
        : 0;

  // Total before gift card
  let total = subtotal - (appliedCoupon?.discount || 0) + shipping + tax + paymentFee;
  if (total < 0) total = 0;

  // Gift Card deduction
  const giftCardDeduction = appliedGiftCard ? Math.min(total, appliedGiftCard.balance) : 0;
  const finalTotal = total - giftCardDeduction;

  const handleApplyCoupon = async () => {
      if(!couponCode) return;
      try {
          const res = await storeService.checkCoupon(couponCode, subtotal);
          setAppliedCoupon(res);
          setCouponCode('');
          alert(`Coupon ${res.coupon} applied! Saved $${res.discount.toFixed(2)}`);
      } catch(e: any) {
          alert(e.message);
      }
  };

  const handleApplyGiftCard = async () => {
      if(!giftCardCode) return;
      try {
          const res = await giftCardService.checkBalance(giftCardCode);
          setAppliedGiftCard(res);
          setGiftCardCode('');
          alert(`Gift Card applied! Balance: $${res.balance.toFixed(2)}`);
      } catch(e: any) {
          alert(e.message);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate Payment Processing for Card if needed
      if (paymentMethod === 'card' && finalTotal > 0) {
          if (cardNumber.length < 13) throw new Error('Invalid Card Number');
          await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      }

      const orderData = {
        orderItems: cart,
        shippingAddress: address,
        paymentMethod: finalTotal === 0 ? 'gift_card' : paymentMethod,
        customerName: `${firstName} ${lastName}`,
        email,
        couponCode: appliedCoupon?.code,
        giftCardCode: appliedGiftCard?.code,
        appliedGiftCardAmount: giftCardDeduction
      };

      const createdOrder = await orderService.createOrder(orderData);
      clearCart();
      navigate(`/order-success/${createdOrder.id || createdOrder._id}`);
    } catch (err) {
      alert('Order failed: ' + (err as Error).message);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={() => navigate('/shop')} className="text-indigo-600 font-medium hover:underline">
                  Continue Shopping
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/shop')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8">
            <ChevronLeft size={16} className="mr-1" /> Return to Shop
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Information */}
          <div className="space-y-8">
            {/* Contact */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                    <input 
                        required
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="First Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input required type="text" placeholder="Last Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input required type="text" placeholder="Address" className="col-span-2 w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
                    <input required type="text" placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                    <div className="flex gap-4">
                        <input required type="text" placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
                        <input required type="text" placeholder="ZIP" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* Payment Options */}
            {finalTotal > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                        {settings?.payment?.stripe?.enabled && (
                            <>
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" className="w-4 h-4 text-indigo-600" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                        <div className="flex items-center gap-2 font-medium text-gray-900"><CreditCard size={20} /> Credit Card</div>
                                    </div>
                                </label>
                                {paymentMethod === 'card' && (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200 animate-in slide-in-from-top-2">
                                        <input type="text" placeholder="Card number" className="w-full px-4 py-2 border border-gray-200 rounded bg-white" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM / YY" className="w-full px-4 py-2 border border-gray-200 rounded bg-white" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                                            <input type="text" placeholder="CVC" className="w-full px-4 py-2 border border-gray-200 rounded bg-white" value={cardCvc} onChange={e => setCardCvc(e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {settings?.payment?.cod?.enabled && (
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" className="w-4 h-4 text-indigo-600" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                    <div className="flex items-center gap-2 font-medium text-gray-900"><DollarSign size={20} /> Cash on Delivery</div>
                                </div>
                                {settings.payment.cod.additionalFee > 0 && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">+${settings.payment.cod.additionalFee} Fee</span>
                                )}
                            </label>
                        )}
                        {settings?.payment?.bankTransfer?.enabled && (
                            <>
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" className="w-4 h-4 text-indigo-600" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                                        <div className="flex items-center gap-2 font-medium text-gray-900"><Landmark size={20} /> Bank Transfer</div>
                                    </div>
                                </label>
                                {paymentMethod === 'bank_transfer' && (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200 animate-in slide-in-from-top-2 text-sm text-gray-700">
                                        <p className="font-bold mb-2">Transfer details:</p>
                                        <div className="flex justify-between"><span>Bank:</span> <span>{settings.payment.bankTransfer.bankName}</span></div>
                                        <div className="flex justify-between"><span>IBAN:</span> <span className="font-mono">{settings.payment.bankTransfer.iban}</span></div>
                                        <div className="flex justify-between"><span>Account:</span> <span>{settings.payment.bankTransfer.accountName}</span></div>
                                        <p className="mt-2 text-xs text-gray-500 italic">{settings.payment.bankTransfer.instructions}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                      {cart.map((item) => (
                          <div key={item.id + (item.selectedVariant?.sku || '')} className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                  <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs px-1.5 rounded-bl-md font-medium">{item.quantity}</span>
                              </div>
                              <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                  <p className="text-xs text-gray-500">{item.selectedVariant?.name}</p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                      ))}
                  </div>

                  {/* Coupon & Gift Card */}
                  <div className="space-y-3 mb-6">
                      <div className="flex gap-2">
                          <input 
                            type="text" placeholder="Discount code" 
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                            value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                            disabled={!!appliedCoupon}
                          />
                          <button 
                            type="button" 
                            onClick={handleApplyCoupon}
                            disabled={!!appliedCoupon}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
                          >
                              {appliedCoupon ? 'Applied' : 'Apply'}
                          </button>
                      </div>
                      
                      <div className="flex gap-2">
                          <input 
                            type="text" placeholder="Gift card code" 
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                            value={giftCardCode} onChange={(e) => setGiftCardCode(e.target.value)}
                            disabled={!!appliedGiftCard}
                          />
                          <button 
                            type="button" 
                            onClick={handleApplyGiftCard}
                            disabled={!!appliedGiftCard}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
                          >
                              <Gift size={14} /> {appliedGiftCard ? 'Applied' : 'Apply'}
                          </button>
                      </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                      {appliedCoupon && (
                          <div className="flex justify-between text-sm text-green-600 font-medium">
                              <span>Discount ({appliedCoupon.code})</span>
                              <span>-${appliedCoupon.discount.toFixed(2)}</span>
                          </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                      {tax > 0 && <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>}
                      {paymentFee > 0 && <div className="flex justify-between text-sm text-gray-600"><span>Payment Fee</span><span>${paymentFee.toFixed(2)}</span></div>}
                      
                      {appliedGiftCard && (
                          <div className="flex justify-between text-sm text-green-600 font-medium">
                              <span>Gift Card ({appliedGiftCard.code})</span>
                              <span>-${giftCardDeduction.toFixed(2)}</span>
                          </div>
                      )}

                      <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : <Truck size={20} />}
                      {loading ? 'Processing...' : 'Place Order'}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <ShieldCheck size={12} /> Secure SSL Checkout
                  </div>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};
