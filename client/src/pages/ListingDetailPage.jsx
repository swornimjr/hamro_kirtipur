import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing } from '../utils/api';
import { getCategoryInfo } from '../utils/categories';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListing(id)
      .then((res) => setListing(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;
  if (!listing) return <div className="container" style={{ paddingTop: 40 }}>Listing not found.</div>;

  const cat = getCategoryInfo(listing.category);
  const [lng, lat] = listing.location.coordinates;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`${listing.name} — ${listing.address || 'Kirtipur'}\nPhone: ${listing.phone || 'N/A'}\nView: ${window.location.href}`)}`;

  const heritageSections = [
    { key: 'history',      label: 'History',               icon: '📜' },
    { key: 'festivals',    label: 'Festivals & Ceremonies', icon: '🎉' },
    { key: 'architecture', label: 'Architecture',           icon: '🏗️' },
  ];
  const knownMetaKeys = new Set(['history', 'festivals', 'architecture', 'alternateNames']);
  const extraMeta = listing.meta
    ? Object.entries(listing.meta).filter(([k]) => !knownMetaKeys.has(k))
    : [];

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40, maxWidth: 680 }}>
      <Link to="/" style={{ color: 'var(--primary)', fontSize: 14, display: 'inline-block', marginBottom: 16 }}>
        ← Back to map
      </Link>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Cover photo */}
        {listing.photo && (
          <img
            src={`/uploads/${listing.photo}`}
            alt={listing.name}
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div className={`listing-icon ${cat.colorClass}`} style={{ width: 48, height: 48, fontSize: 22 }}>
              {cat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{listing.name}</h1>
              {listing.meta?.alternateNames && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Also known as: {listing.meta.alternateNames}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13 }}>
                <span className={`badge ${cat.colorClass}`}>{cat.label}</span>
                {listing.ward && (
                  <Link to={`/wards/${listing.ward}`} style={{ color: 'var(--primary)', fontSize: 13 }}>
                    Ward {listing.ward}
                  </Link>
                )}
                {listing.verified && <span className="badge" style={{ background: '#f0fdf4', color: '#166534' }}>✓ Verified</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Core details */}
        <div style={{ padding: '20px 24px' }}>
          {listing.description && (
            <p style={{ color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>{listing.description}</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {listing.address && (
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span>📍</span><span>{listing.address}</span>
              </div>
            )}
            {listing.phone && (
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span>📞</span>
                <a href={`tel:${listing.phone}`} style={{ color: 'var(--primary)' }}>{listing.phone}</a>
              </div>
            )}
            {listing.hours && (
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <span>🕐</span><span>{listing.hours}</span>
              </div>
            )}
          </div>

          {/* Heritage sections */}
          {heritageSections.map(({ key, label, icon }) =>
            listing.meta?.[key] ? (
              <div key={key} style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-dk)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {icon} {label}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, background: 'var(--bg)', borderRadius: 8, padding: '12px 14px' }}>
                  {listing.meta[key]}
                </p>
              </div>
            ) : null
          )}

          {/* Generic meta (non-heritage fields like services, schedule) */}
          {extraMeta.length > 0 && (
            <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 8, padding: '14px 16px' }}>
              {extraMeta.map(([key, val]) => (
                <div key={key} style={{ fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}: </span>
                  <span>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {listing.phone && (
              <a href={`tel:${listing.phone}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                📞 Call now
              </a>
            )}
            <a href={gmapsUrl} target="_blank" rel="noreferrer" className="btn"
              style={{ border: '1px solid var(--border)', background: 'white', textDecoration: 'none', color: 'var(--text)' }}>
              🗺️ Open in Maps
            </a>
            <a href={waShareUrl} target="_blank" rel="noreferrer" className="btn"
              style={{ border: '1px solid var(--border)', background: 'white', textDecoration: 'none', color: 'var(--text)' }}>
              📤 Share on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
