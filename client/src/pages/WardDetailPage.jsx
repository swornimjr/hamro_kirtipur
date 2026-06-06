import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWard, getListings } from '../utils/api';
import { getCategoryInfo } from '../utils/categories';

export default function WardDetailPage() {
  const { wardNumber } = useParams();
  const [ward, setWard] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getWard(wardNumber),
      getListings({ ward: wardNumber }),
    ])
      .then(([wardRes, listingsRes]) => {
        setWard(wardRes.data.data);
        setListings(listingsRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [wardNumber]);

  if (loading) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;
  if (!ward) return <div className="container" style={{ paddingTop: 40 }}>Ward not found.</div>;

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <Link to="/wards" style={{ color: '#1a6b4a', fontSize: 14, display: 'inline-block', marginBottom: 16 }}>
        ← All wards
      </Link>

      {/* Ward header */}
      <div style={{
        background: '#e8f5ef', borderRadius: 12, padding: '24px 28px',
        display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: '#1a6b4a', lineHeight: 1 }}>
          {ward.wardNumber}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Ward {ward.wardNumber}</h1>
          {ward.area && <p style={{ color: '#6b7280', marginBottom: 8 }}>{ward.area}</p>}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14 }}>
            {ward.chairperson && <span>👤 Chairperson: <strong>{ward.chairperson}</strong></span>}
            {ward.phone && <a href={`tel:${ward.phone}`} style={{ color: '#1a6b4a' }}>📞 {ward.phone}</a>}
            {ward.officeHours && <span>🕐 {ward.officeHours}</span>}
          </div>
        </div>
      </div>

      {/* Garbage schedule */}
      {ward.garbageSchedule?.days?.length > 0 && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '16px 20px', marginBottom: 24
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>♻️ Garbage collection</h2>
          <p style={{ fontSize: 14, color: '#166534' }}>
            <strong>Days:</strong> {ward.garbageSchedule.days.join(', ')}
            {ward.garbageSchedule.time && <> · <strong>Time:</strong> {ward.garbageSchedule.time}</>}
          </p>
          {ward.garbageSchedule.notes && (
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{ward.garbageSchedule.notes}</p>
          )}
        </div>
      )}

      {/* Services in this ward */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        Services in Ward {wardNumber} ({listings.length})
      </h2>
      {listings.length === 0 ? (
        <div style={{ color: '#6b7280', fontSize: 14 }}>
          No listings yet for this ward.{' '}
          <Link to="/suggest" style={{ color: '#1a6b4a' }}>Add one?</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {listings.map((listing) => {
            const cat = getCategoryInfo(listing.category);
            return (
              <Link key={listing._id} to={`/listing/${listing._id}`} className="listing-card">
                <div className={`listing-icon ${cat.colorClass}`}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3>{listing.name}</h3>
                  <p>{listing.address || cat.label}</p>
                </div>
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, color: '#1a6b4a', fontWeight: 500 }}
                  >
                    📞 Call
                  </a>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
