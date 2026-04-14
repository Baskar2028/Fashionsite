import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import fashion1 from '@/assets/fashion1.png';
import fashion2 from '@/assets/fashion2.png';
import fashion3 from '@/assets/fashion3.png';
import fashion4 from '@/assets/fashion4.png';
import fashion5 from '@/assets/fashion5.png';

const imageMap: Record<string, string> = {
  '/fashion1': fashion1,
  '/fashion2': fashion2,
  '/fashion3': fashion3,
  '/fashion4': fashion4,
  '/fashion5': fashion5,
};

interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  products: { name: string; price: number; image_url: string | null };
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('luxefashion@upi');
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(name, price, image_url)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setItems((data as any) || []);
        setLoading(false);
      });
  }, [user]);

  const total = items.reduce((sum, i) => sum + i.products.price * i.quantity, 0);

  const upiDeepLink = `upi://pay?pa=${upiId}&pn=LUXE%20FASHION&am=${total}&cu=INR&tn=Order%20Payment`;

  const handleSimulatePayment = async () => {
    if (!user) return;
    setProcessing(true);

    const simulatedTxnId = 'TXN' + Date.now().toString(36).toUpperCase();
    setTxnId(simulatedTxnId);

    // Create order
    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        status: 'completed',
        payment_method: 'upi',
        upi_transaction_id: simulatedTxnId,
      })
      .select()
      .single();

    if (order) {
      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));
      await supabase.from('order_items').insert(orderItems);

      // Clear cart
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }

    setProcessing(false);
    setStep('success');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="spinner-border" style={{ color: '#ffc107' }}></div>
        </div>
      </>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
          <div className="container text-center py-5">
            <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
            <p className="mt-3" style={{ color: '#888' }}>Your cart is empty</p>
            <button className="btn btn-auth" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '700px' }}>

          {/* Progress Steps */}
          <div className="d-flex justify-content-center mb-5 gap-2">
            {['Review', 'Payment', 'Confirmation'].map((label, idx) => {
              const stepIdx = idx;
              const currentIdx = step === 'review' ? 0 : step === 'payment' ? 1 : 2;
              return (
                <div key={label} className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: stepIdx <= currentIdx ? 'linear-gradient(135deg, #ffc107, #ffab00)' : '#e0e0e0',
                      color: stepIdx <= currentIdx ? '#1a1a2e' : '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem',
                    }}
                  >
                    {stepIdx < currentIdx ? <i className="bi bi-check-lg"></i> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: stepIdx <= currentIdx ? '#1a1a2e' : '#888', fontWeight: stepIdx === currentIdx ? 600 : 400 }}>
                    {label}
                  </span>
                  {idx < 2 && <div style={{ width: '40px', height: '2px', background: stepIdx < currentIdx ? '#ffc107' : '#e0e0e0' }}></div>}
                </div>
              );
            })}
          </div>

          {/* Step 1: Review */}
          {step === 'review' && (
            <>
              <h2 className="section-title mb-4">Order Review</h2>
              {items.map((item) => (
                <div key={item.id} className="card mb-3" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div className="card-body d-flex align-items-center gap-3 p-3">
                    <img
                      src={imageMap[item.products.image_url || ''] || ''}
                      alt={item.products.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-semibold">{item.products.name}</h6>
                      <small style={{ color: '#888' }}>Qty: {item.quantity}</small>
                    </div>
                    <span className="fw-bold">₹ {(item.products.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="card mt-3" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div className="card-body d-flex justify-content-between p-4">
                  <h5 className="mb-0 fw-bold">Total</h5>
                  <h4 className="mb-0 product-price">₹ {total.toLocaleString()}</h4>
                </div>
              </div>
              <button className="btn btn-auth w-100 mt-4" onClick={() => setStep('payment')}>
                Proceed to Payment <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <>
              <h2 className="section-title mb-4">UPI Payment</h2>
              <div className="card" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <div className="card-body p-4 text-center">
                  <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <p className="fw-semibold mb-2" style={{ color: '#888', fontSize: '0.85rem' }}>Amount to Pay</p>
                    <h2 className="product-price mb-0" style={{ fontSize: '2.2rem' }}>₹ {total.toLocaleString()}</h2>
                  </div>

                  {/* QR Code placeholder */}
                  <div style={{
                    width: '200px', height: '200px', margin: '0 auto 20px',
                    background: '#fff', border: '2px solid #e0e0e0', borderRadius: '16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '8px',
                  }}>
                    <i className="bi bi-qr-code" style={{ fontSize: '4rem', color: '#1a1a2e' }}></i>
                    <small style={{ color: '#888' }}>Scan to Pay</small>
                  </div>

                  <p className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>UPI ID: {upiId}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>Pay via any UPI app</p>

                  {/* UPI Deep Link */}
                  <a
                    href={upiDeepLink}
                    className="btn btn-outline-dark w-100 mb-3"
                    style={{ borderRadius: '50px', fontWeight: 600, padding: '12px' }}
                  >
                    <i className="bi bi-phone me-2"></i>Open UPI App
                  </a>

                  <div className="d-flex gap-3 justify-content-center mb-4" style={{ fontSize: '0.8rem', color: '#888' }}>
                    <span><i className="bi bi-shield-check me-1" style={{ color: '#28a745' }}></i>Secure Payment</span>
                    <span><i className="bi bi-lock me-1" style={{ color: '#ffc107' }}></i>Encrypted</span>
                  </div>

                  <hr style={{ borderColor: '#f0f0f0' }} />

                  <p className="mb-3" style={{ color: '#888', fontSize: '0.85rem' }}>
                    For demo purposes, click below to simulate a successful payment
                  </p>

                  <button
                    className="btn btn-auth w-100"
                    onClick={handleSimulatePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2"></i>Simulate Payment</>
                    )}
                  </button>

                  <button className="btn btn-link mt-2" style={{ color: '#888', fontSize: '0.85rem' }} onClick={() => setStep('review')}>
                    <i className="bi bi-arrow-left me-1"></i>Back to Review
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-5">
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 8px 25px rgba(40,167,69,0.3)',
              }}>
                <i className="bi bi-check-lg" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
              </div>
              <h2 className="section-title mb-3">Payment Successful!</h2>
              <p style={{ color: '#888', fontSize: '1rem', marginBottom: '8px' }}>Your order has been placed successfully</p>
              <p className="fw-semibold" style={{ color: '#1a1a2e' }}>Transaction ID: {txnId}</p>
              <div className="card mx-auto mt-4" style={{ maxWidth: '300px', borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div className="card-body p-3 text-center">
                  <small style={{ color: '#888' }}>Amount Paid</small>
                  <h4 className="product-price mb-0">₹ {total.toLocaleString()}</h4>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <button className="btn btn-auth" onClick={() => navigate('/orders')}>
                  <i className="bi bi-box-seam me-2"></i>View Orders
                </button>
                <button className="btn btn-outline-dark" style={{ borderRadius: '50px', fontWeight: 600, padding: '12px 28px' }} onClick={() => navigate('/')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
