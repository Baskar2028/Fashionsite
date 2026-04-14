import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName, phone, address, gender, dob },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to verify, then log in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess('');
    setDisplayName('');
    setPhone('');
    setAddress('');
    setGender('');
    setDob('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header text-center">
          <h2 className="auth-brand">
            <span style={{ color: '#ffc107' }}>LUXE</span> FASHION
          </h2>
          <p className="auth-tagline">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: '0.9rem', borderRadius: '10px' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2" style={{ fontSize: '0.9rem', borderRadius: '10px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ color: '#555' }}>Full Name</label>
                <input
                  type="text"
                  className="form-control auth-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-medium" style={{ color: '#555' }}>Gender</label>
                  <select
                    className="form-select auth-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium" style={{ color: '#555' }}>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control auth-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium" style={{ color: '#555' }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control auth-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium" style={{ color: '#555' }}>Address</label>
                <textarea
                  className="form-control auth-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows={2}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label fw-medium" style={{ color: '#555' }}>Email Address</label>
            <input
              type="email"
              className="form-control auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium" style={{ color: '#555' }}>Password</label>
            <input
              type="password"
              className="form-control auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-auth w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : null}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: '#777', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="btn btn-link p-0 fw-semibold"
              style={{ color: '#ffc107', textDecoration: 'none', fontSize: '0.9rem' }}
              onClick={() => { setIsLogin(!isLogin); resetForm(); }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
