import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DirectoryMap from '../components/Map/DirectoryMap';
import { getListings } from '../utils/api';
import { CATEGORIES, getCategoryInfo } from '../utils/categories';

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ verified: true })
      .then((res) => {
        setListings(res.data.data);
        setFiltered(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = listings;
    if (activeCategory !== 'all') {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.address && l.address.toLowerCase().includes(q)) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [activeCategory, search, listings]);

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="page-header">
        <h1>Kirtipur Local Directory</h1>
        <p>Find health posts, schools, water points, ward offices and more across Kirtipur municipality.</p>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search by name, area, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
            ✕
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All ({listings.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = listings.filter((l) => l.category === cat.key).length;
          return (
            <button
              key={cat.key}
              className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.icon} {cat.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="map-container" style={{ marginBottom: 24 }}>
        {!loading && <DirectoryMap listings={filtered} />}
      </div>

      {/* Listing cards below map */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
        {filtered.length} place{filtered.length !== 1 ? 's' : ''} found
      </h2>
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading listings...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          <p>No listings found. <Link to="/suggest" style={{ color: '#1a6b4a' }}>Suggest one?</Link></p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((listing) => {
            const cat = getCategoryInfo(listing.category);
            return (
              <Link key={listing._id} to={`/listing/${listing._id}`} className="listing-card">
                <div className={`listing-icon ${cat.colorClass}`}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3>{listing.name}</h3>
                  <p>
                    {listing.ward ? `Ward ${listing.ward} · ` : ''}
                    {listing.address || cat.label}
                  </p>
                </div>
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, color: '#1a6b4a', fontWeight: 500, whiteSpace: 'nowrap' }}
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
