import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: '', phone: '', address: '', gender: '', dob: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setForm({
          display_name: data.display_name || '',
          phone: data.phone || '',
          address: data.address || '',
          gender: data.gender || '',
          dob: data.dob || '',
        });
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data } = await supabase
      .from('profiles')
      .update({
        display_name: form.display_name,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        dob: form.dob || null,
      })
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setProfile(data);
    setEditing(false);
    setSaving(false);
  };

  const genderLabel = (g: string) => g ? g.charAt(0).toUpperCase() + g.slice(1) : '—';

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 className="section-title mb-4">My Profile</h2>
          {profile ? (
            <div className="card" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="profile-avatar-circle profile-avatar-lg mx-auto" style={{ width: '70px', height: '70px', fontSize: '1.8rem' }}>
                    {(profile.display_name?.[0] || 'U').toUpperCase()}
                  </div>
                </div>
                {editing ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Display Name</label>
                      <input className="form-control auth-input" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-medium">Gender</label>
                        <select className="form-select auth-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-medium">Date of Birth</label>
                        <input type="date" className="form-control auth-input" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Phone</label>
                      <input className="form-control auth-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Address</label>
                      <textarea className="form-control auth-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} />
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-auth flex-fill" onClick={handleSave} disabled={saving}>
                        {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}Save
                      </button>
                      <button className="btn btn-outline-secondary flex-fill" onClick={() => setEditing(false)} style={{ borderRadius: '50px' }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3"><strong>Name:</strong> {profile.display_name || '—'}</div>
                    <div className="mb-3"><strong>Email:</strong> {profile.email || user?.email}</div>
                    <div className="mb-3"><strong>Gender:</strong> {genderLabel(profile.gender)}</div>
                    <div className="mb-3"><strong>Date of Birth:</strong> {profile.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</div>
                    <div className="mb-3"><strong>Phone:</strong> {profile.phone || '—'}</div>
                    <div className="mb-3"><strong>Address:</strong> {profile.address || '—'}</div>
                    <button className="btn btn-auth w-100" onClick={() => setEditing(true)}>Edit Profile</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center"><div className="spinner-border" style={{ color: '#ffc107' }}></div></div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
