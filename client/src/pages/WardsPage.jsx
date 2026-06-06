import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWards } from '../utils/api';

export default function WardsPage() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWards()
      .then((res) => setWards(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="page-header">
        <h1>Kirtipur Wards</h1>
        <p>Kirtipur municipality has 11 wards. Click a ward to see its office, garbage schedule, and services.</p>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading wards...</p>
      ) : (
        <div className="ward-grid">
          {wards.map((ward) => (
            <Link key={ward.wardNumber} to={`/wards/${ward.wardNumber}`} className="ward-card">
              <div className="ward-number">{ward.wardNumber}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                Ward {ward.wardNumber}
              </div>
              {ward.area && (
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{ward.area}</div>
              )}
              {ward.garbageSchedule?.days?.length > 0 && (
                <div style={{ fontSize: 12, color: '#16a34a' }}>
                  ♻️ Garbage: {ward.garbageSchedule.days.join(', ')}
                </div>
              )}
              {ward.chairperson && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  Chair: {ward.chairperson}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#1a6b4a', marginTop: 8, fontWeight: 500 }}>
                View services →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
