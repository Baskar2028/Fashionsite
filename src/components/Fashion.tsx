import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const Fashion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase.from('products').select('*').order('created_at').then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBuyNow = (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    addToCart(productId).then(() => navigate('/checkout'));
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));

    // Upsert: if already in cart, increment quantity
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ user_id: user.id, product_id: productId, quantity: 1 });
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [productId]: false })), 2000);
  };

  return (
    <section id="fashion" className="fashion-section">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="section-title">Our Collection</h2>
          <p className="section-subtitle">Handpicked styles for the modern man</p>
        </div>
        <div className="row g-4 justify-content-center">
          {products.map((item, idx) => (
            <div className="col-lg-4 col-md-6" key={item.id} data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="card fashion-card h-100">
                <div className="card-img-container">
                  <img src={imageMap[item.image_url] || item.image_url || ''} alt={item.name} loading="lazy" />
                  <button
                    className={`heart-icon ${liked[item.id] ? 'active' : 'inactive'}`}
                    onClick={() => toggleLike(item.id)}
                    aria-label="Like"
                  >
                    <i className={`bi ${liked[item.id] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                </div>
                <div className="card-body d-flex flex-column">
                  <p className="mb-1 fw-medium" style={{ color: '#888', fontSize: '0.85rem' }}>{item.name}</p>
                  <p className="product-price mb-3">₹ {Number(item.price).toLocaleString()}</p>
                  <div className="d-flex gap-2 mt-auto">
                    <button className="btn btn-buy flex-fill">Buy Now</button>
                    <button
                      className={`btn flex-fill ${addedToCart[item.id] ? 'btn-success' : 'btn-outline-dark'}`}
                      style={{ borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600 }}
                      onClick={() => addToCart(item.id)}
                      disabled={addingToCart[item.id]}
                    >
                      {addingToCart[item.id] ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : addedToCart[item.id] ? (
                        <><i className="bi bi-check-lg me-1"></i>Added</>
                      ) : (
                        <><i className="bi bi-cart-plus me-1"></i>Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fashion;
