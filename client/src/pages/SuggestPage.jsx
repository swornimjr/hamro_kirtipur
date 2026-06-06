import React, { useState } from 'react';
import { suggestListing } from '../utils/api';
import { CATEGORIES } from '../utils/categories';

export default function SuggestPage() {
  const [form, setForm] = useState({
    name: '', category: '', address: '', phone: '',
    description: '', ward: '', suggestedBy: '',
  });
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    setLoading(true);
    try {
      // Default coords to Kirtipur centre — admin will update exact location later
      const payload = {
        ...form,
        ward: form.ward ? Number(form.ward) : null,
        location: { type: 'Point', coordinates: [85.2801, 27.6774] },
      };
      await suggestListing(payload);
      setStatus('success');
      setForm({ name: '', category: '', address: '', phone: '', description: '', ward: '', suggestedBy: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40, maxWidth: 600 }}>
      <div className="page-header">
        <h1>Suggest a place</h1>
        <p>Know a health post, school, water tap or local service not on the map? Add it here — we'll review and publish it.</p>
      </div>

      {status === 'success' && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', marginBottom: 24, color: '#166534' }}>
          ✅ Thank you! Your suggestion has been submitted and will be reviewed shortly.
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#fdf2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 18px', marginBottom: 24, color: '#991b1b' }}>
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={submit} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px' }}>
        <div className="form-group">
          <label>Place name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="e.g. Panga Health Post" required />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handle} required>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Ward number (1–11)</label>
            <input name="ward" type="number" min={1} max={11} value={form.ward} onChange={handle} placeholder="e.g. 7" />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="01-XXXXXXX" />
          </div>
        </div>
        <div className="form-group">
          <label>Address / location description</label>
          <input name="address" value={form.address} onChange={handle} placeholder="e.g. Near Chilancho Pond, Kirtipur" />
        </div>
        <div className="form-group">
          <label>Description (optional)</label>
          <textarea name="description" value={form.description} onChange={handle}
            rows={3} placeholder="What services does this place offer?" />
        </div>
        <div className="form-group">
          <label>Your name or contact (optional)</label>
          <input name="suggestedBy" value={form.suggestedBy} onChange={handle} placeholder="So we can credit you" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Submitting...' : 'Submit suggestion'}
        </button>
      </form>
    </div>
  );
}
