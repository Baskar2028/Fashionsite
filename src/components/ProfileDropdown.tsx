import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; email: string | null } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const { user, signOut } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('user_id', user.id)
        .single();
      if (data) setProfile(data);
    };

    const fetchCartCount = async () => {
      const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setCartCount(count ?? 0);
    };

    fetchProfile();
    fetchCartCount();

    // Subscribe to cart changes
    const channel = supabase
      .channel('cart-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` }, () => {
        fetchCartCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) return null;

  const initial = (profile?.display_name?.[0] || user.email?.[0] || 'U').toUpperCase();

  return (
    <div className="profile-dropdown-wrapper" ref={ref}>
      <button className="profile-avatar-btn" onClick={() => setOpen(!open)}>
        <span className="profile-avatar-circle">{initial}</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {open && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-avatar-circle profile-avatar-lg">{initial}</div>
            <div>
              <p className="fw-semibold mb-0" style={{ color: '#1a1a2e' }}>{profile?.display_name || 'User'}</p>
              <small style={{ color: '#888' }}>{profile?.email || user.email}</small>
            </div>
          </div>
          <div className="profile-dropdown-divider"></div>
          <button className="profile-dropdown-item" onClick={() => { navigate('/profile'); setOpen(false); }}>
            <i className="bi bi-person me-2"></i> My Profile
          </button>
          <button className="profile-dropdown-item" onClick={() => { navigate('/cart'); setOpen(false); }}>
            <i className="bi bi-cart3 me-2"></i> Cart
            {cartCount > 0 && <span className="badge bg-warning text-dark ms-auto">{cartCount}</span>}
          </button>
          <button className="profile-dropdown-item" onClick={() => { navigate('/orders'); setOpen(false); }}>
            <i className="bi bi-box-seam me-2"></i> Orders
          </button>
          <div className="profile-dropdown-divider"></div>
          <button className="profile-dropdown-item text-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
