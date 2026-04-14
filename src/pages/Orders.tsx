import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  const statusColor = (s: string) => {
    switch (s) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title mb-4">My Orders</h2>
          {loading ? (
            <div className="text-center"><div className="spinner-border" style={{ color: '#ffc107' }}></div></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3" style={{ color: '#888' }}>No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card mb-3" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <small style={{ color: '#888' }}>Order #{order.id.slice(0, 8)}</small>
                      <h5 className="mb-0 product-price" style={{ fontSize: '1.1rem' }}>₹ {Number(order.total_amount).toLocaleString()}</h5>
                    </div>
                    <span className="badge" style={{ background: statusColor(order.status), padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem' }}>
                      {order.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between" style={{ color: '#888', fontSize: '0.85rem' }}>
                    <span><i className="bi bi-credit-card me-1"></i>{order.payment_method || 'UPI'}</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
