import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
  products: {
    name: string;
    price: number;
    image_url: string | null;
  };
}

const Cart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(name, price, image_url)')
      .eq('user_id', user.id) as any;
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) {
      await supabase.from('cart_items').delete().eq('id', id);
    } else {
      await supabase.from('cart_items').update({ quantity: qty }).eq('id', id);
    }
    fetchCart();
  };

  const removeItem = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id);
    fetchCart();
  };

  const total = items.reduce((sum, i) => sum + i.products.price * i.quantity, 0);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title mb-4">Shopping Cart</h2>
          {loading ? (
            <div className="text-center"><div className="spinner-border" style={{ color: '#ffc107' }}></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3" style={{ color: '#888' }}>Your cart is empty</p>
              <button className="btn btn-auth" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="card mb-3" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div className="card-body d-flex align-items-center gap-3 p-3">
                    <img
                      src={imageMap[item.products.image_url || ''] || item.products.image_url || ''}
                      alt={item.products.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{item.products.name}</h6>
                      <p className="mb-0 product-price" style={{ fontSize: '1rem' }}>₹ {item.products.price.toLocaleString()}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span className="fw-semibold" style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="btn btn-sm" onClick={() => removeItem(item.id)} style={{ color: '#e74c3c' }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <div className="card mt-4" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div className="card-body d-flex justify-content-between align-items-center p-4">
                  <h5 className="mb-0 fw-bold">Total</h5>
                  <h4 className="mb-0 product-price">₹ {total.toLocaleString()}</h4>
                </div>
              </div>
              <button className="btn btn-auth w-100 mt-3" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
