import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';

function authHeader() {
  const t = localStorage.getItem('adminToken');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiFetch(method, path, body = null, isForm = false) {
  const headers = { ...authHeader() };
  if (!isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch('/api' + path, {
    method,
    headers,
    body: isForm ? body : (body ? JSON.stringify(body) : null),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

const BLANK = {
  name: '', category: 'health', ward: '', address: '',
  phone: '', hours: '', description: '',
  lat: '27.6774', lng: '85.2801', photo: '', verified: true,
};

// ── Sub-components ────────────────────────────────────────────────

function AdminHeader({ onLogout }) {
  return (
    <div style={{
      background: 'white', borderBottom: '1px solid var(--border)',
      padding: '0 20px', height: 56, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/logo.png" alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} />
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--primary-dk)' }}>Admin</span>
        <span style={{
          fontSize: 11, background: 'var(--accent)', color: 'white',
          padding: '2px 8px', borderRadius: 20, fontWeight: 500,
        }}>Hamro Kirtipur</span>
      </div>
      <button
        onClick={onLogout}
        style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 6, padding: '5px 14px', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)',
        }}
      >
        Sign out
      </button>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--accent-lt)' : 'white',
      border: `1px solid ${accent ? '#f4c4a8' : 'var(--border)'}`,
      borderRadius: 10, padding: '14px 20px', flex: 1, minWidth: 100,
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--primary-dk)' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SuggestionCard({ listing, onEdit, onApprove, onReject }) {
  const hasCoords = listing.location?.coordinates?.length === 2;
  return (
    <div style={{
      background: 'white', border: '1px solid #fde68a',
      borderRadius: 10, padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {listing.photo
          ? <img src={`/uploads/${listing.photo}`} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {CATEGORIES.find(c => c.key === listing.category)?.icon || '📍'}
            </div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{listing.name}</span>
            <span style={{ fontSize: 11, background: 'var(--primary-lt)', color: 'var(--primary-dk)', padding: '2px 8px', borderRadius: 20 }}>
              {listing.category}
            </span>
            {listing.ward && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ward {listing.ward}</span>}
          </div>
          {listing.address && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{listing.address}</p>}
          {listing.phone && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>📞 {listing.phone}</p>}
          {listing.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{listing.description}</p>}
          {!hasCoords && (
            <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>⚠ No GPS coordinates — edit before approving</p>
          )}
          {hasCoords && (
            <p style={{ fontSize: 11, color: '#9ca3af' }}>
              {listing.location.coordinates[1].toFixed(4)}, {listing.location.coordinates[0].toFixed(4)}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={onEdit} style={btnStyle('outline')}>Edit</button>
        <button onClick={onApprove} style={btnStyle('approve')}>✓ Approve</button>
        <button onClick={onReject} style={btnStyle('reject')}>✗ Reject</button>
      </div>
    </div>
  );
}

function ListingRow({ listing, onEdit, onDelete }) {
  const cat = CATEGORIES.find(c => c.key === listing.category);
  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 16px',
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{cat?.icon || '📍'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>{listing.name}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{listing.category}{listing.ward ? ` · Ward ${listing.ward}` : ''}</span>
      </div>
      {!listing.verified && (
        <span style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
          unverified
        </span>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onEdit} style={btnStyle('outline')}>Edit</button>
        <button onClick={onDelete} style={btnStyle('reject')}>Delete</button>
      </div>
    </div>
  );
}

function ListingForm({ form, setForm, onSave, onCancel, saving, photoUploading, onPhotoChange, fileRef, isNew }) {
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const hasPhoto = Boolean(form.photo);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
      {/* Left: fields */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Name *</label>
            <input value={form.name} onChange={f('name')} placeholder="e.g. Kirtipur Hospital" />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={f('category')}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ward (1–11)</label>
            <select value={form.ward} onChange={f('ward')}>
              <option value="">— None —</option>
              {Array.from({ length: 11 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>Ward {n}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <input value={form.address} onChange={f('address')} placeholder="e.g. Naya Bazaar, Kirtipur" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={f('phone')} placeholder="01-4331278" />
          </div>
          <div className="form-group">
            <label>Hours</label>
            <input value={form.hours} onChange={f('hours')} placeholder="Sun–Fri 10am–5pm" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} placeholder="Brief description…" />
          </div>
          <div className="form-group">
            <label>Latitude *</label>
            <input value={form.lat} onChange={f('lat')} placeholder="27.6774" type="number" step="any" />
          </div>
          <div className="form-group">
            <label>Longitude *</label>
            <input value={form.lng} onChange={f('lng')} placeholder="85.2801" type="number" step="any" />
          </div>
          {!isNew && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                id="verified-cb" type="checkbox"
                checked={form.verified}
                onChange={e => setForm(p => ({ ...p, verified: e.target.checked }))}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="verified-cb" style={{ margin: 0, cursor: 'pointer' }}>Mark as verified</label>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : (isNew ? 'Create listing' : 'Save changes')}
          </button>
          <button className="btn" onClick={onCancel} style={{ background: 'var(--border)', color: 'var(--text)' }}>
            Cancel
          </button>
        </div>
      </div>

      {/* Right: photo */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>Cover photo</div>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed var(--border)', borderRadius: 10,
            height: 200, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden', position: 'relative',
            background: 'var(--bg)',
          }}
        >
          {hasPhoto
            ? <img src={`/uploads/${form.photo}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : photoUploading
              ? <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Uploading…</span>
              : <>
                  <span style={{ fontSize: 28, marginBottom: 8 }}>📷</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click to upload photo</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Max 5 MB · JPG / PNG</span>
                </>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoChange} />
        {hasPhoto && (
          <button
            onClick={() => setForm(p => ({ ...p, photo: '' }))}
            style={{ marginTop: 8, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Remove photo
          </button>
        )}
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          Photo is uploaded immediately when you select a file.
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────

function btnStyle(variant) {
  const base = {
    border: 'none', borderRadius: 6, padding: '6px 14px',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
  };
  if (variant === 'outline') return { ...base, background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)' };
  if (variant === 'approve') return { ...base, background: '#dcfce7', color: '#166534' };
  if (variant === 'reject') return { ...base, background: '#fee2e2', color: '#991b1b' };
  return base;
}

// ── Main component ────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('queue');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { navigate('/admin/login'); return; }
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch('GET', '/listings');
      setListings(data.data);
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }

  function startEdit(l) {
    setForm({
      name: l.name || '',
      category: l.category || 'health',
      ward: l.ward != null ? String(l.ward) : '',
      address: l.address || '',
      phone: l.phone || '',
      hours: l.hours || '',
      description: l.description || '',
      lat: l.location?.coordinates?.[1] != null ? String(l.location.coordinates[1]) : '27.6774',
      lng: l.location?.coordinates?.[0] != null ? String(l.location.coordinates[0]) : '85.2801',
      photo: l.photo || '',
      verified: l.verified ?? false,
    });
    setEditing(l._id);
  }

  function startNew() {
    setForm({ ...BLANK });
    setEditing('new');
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const data = await apiFetch('POST', '/admin/upload', fd, true);
      setForm(f => ({ ...f, photo: data.filename }));
    } catch {
      alert('Photo upload failed.');
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('Name is required.');
    if (!form.lat || !form.lng) return alert('Coordinates are required.');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      ward: form.ward !== '' ? Number(form.ward) : null,
      address: form.address,
      phone: form.phone,
      hours: form.hours,
      description: form.description,
      photo: form.photo,
      verified: form.verified,
      location: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
    };
    try {
      if (editing === 'new') {
        await apiFetch('POST', '/listings', payload);
      } else {
        await apiFetch('PUT', `/listings/${editing}`, payload);
      }
      setEditing(null);
      await load();
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function quickApprove(id) {
    try {
      await apiFetch('PUT', `/listings/${id}`, { verified: true });
      await load();
    } catch (e) { alert(e.message); }
  }

  async function deleteListing(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await apiFetch('DELETE', `/listings/${id}`);
      await load();
    } catch (e) { alert(e.message); }
  }

  const queue = listings.filter(l => !l.verified);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminHeader onLogout={logout} />
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
    </div>
  );

  // Form view (edit or new)
  if (editing !== null) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <AdminHeader onLogout={logout} />
        <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
          <button
            onClick={() => setEditing(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 14, marginBottom: 20, padding: 0 }}
          >
            ← Back to dashboard
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--primary-dk)' }}>
            {editing === 'new' ? 'New Listing' : 'Edit Listing'}
          </h2>
          <ListingForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
            photoUploading={photoUploading}
            onPhotoChange={handlePhotoChange}
            fileRef={fileRef}
            isNew={editing === 'new'}
          />
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminHeader onLogout={logout} />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <StatCard label="Review queue" value={queue.length} accent={queue.length > 0} />
          <StatCard label="Total listings" value={listings.length} />
          <StatCard label="Verified" value={listings.filter(l => l.verified).length} />
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border)', marginBottom: 20, paddingBottom: 0 }}>
          {[
            { key: 'queue', label: `Review Queue${queue.length > 0 ? ` (${queue.length})` : ''}` },
            { key: 'all', label: `All Listings (${listings.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 16px', fontSize: 14, fontWeight: 500,
                color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -2, fontFamily: 'Outfit, sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={startNew}
            className="btn btn-primary"
            style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: 13 }}
          >
            + New Listing
          </button>
        </div>

        {/* Tab content */}
        {tab === 'queue' && (
          queue.length === 0
            ? <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No pending suggestions.
              </div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {queue.map(l => (
                  <SuggestionCard
                    key={l._id}
                    listing={l}
                    onEdit={() => startEdit(l)}
                    onApprove={() => quickApprove(l._id)}
                    onReject={() => deleteListing(l._id, l.name)}
                  />
                ))}
              </div>
        )}

        {tab === 'all' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {listings.map(l => (
              <ListingRow
                key={l._id}
                listing={l}
                onEdit={() => startEdit(l)}
                onDelete={() => deleteListing(l._id, l.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
