import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../utils/categories';

const SECTIONS = [
  {
    key: 'heritage',
    title: 'Heritage & Worship',
    subtitle: 'Ancient temples, stupas and monasteries of the Newar hilltop town',
    icon: '🛕',
    categories: ['temple', 'stupa', 'gumba'],
    accent: '#b91c1c',
    accentBg: '#fef2f2',
    mapCategory: 'temple',
  },
  {
    key: 'food',
    title: 'Eat & Drink',
    subtitle: 'Newari cuisine, local dhabas and valley-view restaurants',
    icon: '🍽️',
    categories: ['restaurant'],
    accent: '#c2410c',
    accentBg: '#fff7ed',
    mapCategory: 'restaurant',
  },
  {
    key: 'sports',
    title: 'Sports & Recreation',
    subtitle: 'Futsal courts, gyms and swimming pools',
    icon: '⚽',
    categories: ['futsal', 'gym', 'swimming-pool'],
    accent: '#15803d',
    accentBg: '#f0fdf4',
    mapCategory: 'futsal',
  },
  {
    key: 'shopping',
    title: 'Markets & Shopping',
    subtitle: 'Local bazaar, gift shops and souvenirs',
    icon: '🛒',
    categories: ['mart', 'gift-shop', 'business'],
    accent: '#0e7490',
    accentBg: '#ecfeff',
    mapCategory: 'mart',
  },
];

const JATRAS = [
  {
    name: 'Bagh Bhairab Jatra',
    location: 'Baghbhairav Temple, Old Town',
    season: 'Bhadra (Aug–Sep)',
    description:
      'The biggest festival in Kirtipur. A grand procession honouring Bhairav as the tiger protector-deity of the town, with music, offerings and community celebrations across the old quarter.',
    icon: '🐯',
    ward: 1,
  },
  {
    name: 'Nhega Jatra',
    location: 'Jal Binayak Temple, Chobar',
    season: 'Shrawan (Jul–Aug)',
    description:
      'Celebrates one of the four sacred Ganesh shrines of the Kathmandu Valley. Pilgrims from across the valley visit Chobar for puja and the jatra procession.',
    icon: '🐘',
    ward: 6,
  },
  {
    name: 'Anandaadi Lokeshwor Jatra',
    location: 'Aadinath Monastery, Chovar',
    season: 'Chaitra (Mar–Apr)',
    description:
      'A valley-wide celebration of the oldest of the four Lokeswaras. Features Cha Puja, Pi Puja, bathing ceremonies and a grand procession from Chovar through the old town.',
    icon: '🙏',
    ward: 6,
  },
  {
    name: 'Sithi Nakha',
    location: 'Kirtipur Old Town & dharas',
    season: 'Jestha (May–Jun)',
    description:
      'Newari festival marking the start of monsoon. Communities come together to clean and repair stone spouts (dharas) and celebrate Kumar/Skanda with offerings at local shrines.',
    icon: '💧',
    ward: null,
  },
  {
    name: 'Gai Jatra',
    location: 'Old Town lanes, Kirtipur',
    season: 'Bhadra (Aug)',
    description:
      'The cow procession festival, celebrated in Kirtipur old town to honour those who have passed away in the previous year. Families dress as cows and parade through the ancient lanes.',
    icon: '🐄',
    ward: null,
  },
  {
    name: 'Mha Puja',
    location: 'Chilancho Stupa & homes',
    season: 'Kartik (Oct–Nov)',
    description:
      'Nepal Sambat New Year — Newars perform self-worship (Mha Puja) at home altars and gather at Chilancho for community celebrations marking the Newari new year.',
    icon: '🪔',
    ward: 10,
  },
  {
    name: 'Indra Jatra',
    location: 'Old Town, Kirtipur',
    season: 'Bhadra (Sep)',
    description:
      'Kirtipur\'s observance of the Kathmandu Valley\'s Indra Jatra — chariot processions, masked dances (Kumari, Ganesh, Bhairav), and lakhey performances in the old town.',
    icon: '🎭',
    ward: null,
  },
  {
    name: 'Yomari Punhi',
    location: 'Newar homes & community halls',
    season: 'Mangshir (Nov–Dec)',
    description:
      'Newari winter harvest festival. Families make yomari — sweet rice-flour dumplings — and share them with neighbours. Children go door to door singing yomari songs.',
    icon: '🍡',
    ward: null,
  },
];

function ListingCard({ listing }) {
  const cat = CATEGORIES.find(c => c.key === listing.category);
  return (
    <Link
      to={`/listing/${listing._id}`}
      style={{
        display: 'block',
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        flexShrink: 0,
        width: 240,
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{
        height: 130,
        background: 'var(--primary-lt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, overflow: 'hidden',
      }}>
        {listing.photo
          ? <img src={`/uploads/${listing.photo}`} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : cat?.icon || '📍'
        }
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        {listing.ward && (
          <span style={{
            fontSize: 11, fontWeight: 500, color: 'var(--primary)',
            background: 'var(--primary-lt)', padding: '2px 8px',
            borderRadius: 20, display: 'inline-block', marginBottom: 6,
          }}>
            Ward {listing.ward}
          </span>
        )}
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--primary-dk)', marginBottom: 4, lineHeight: 1.3 }}>
          {listing.name}
        </div>
        {listing.description && (
          <p style={{
            fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function ListingsSection({ section, listings }) {
  const items = listings.filter(l => section.categories.includes(l.category));

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{
              fontSize: 20, background: section.accentBg,
              width: 40, height: 40, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{section.icon}</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-dk)', margin: 0 }}>{section.title}</h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 0 50px' }}>{section.subtitle}</p>
        </div>
        <Link to={`/?category=${section.mapCategory}`} style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>
          View on map →
        </Link>
      </div>

      {items.length === 0 ? (
        <div style={{
          background: section.accentBg, border: `1px dashed ${section.accent}40`,
          borderRadius: 12, padding: '32px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{section.icon}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 12px' }}>No listings yet in this category.</p>
          <Link to="/suggest" style={{ fontSize: 13, color: section.accent, fontWeight: 600, textDecoration: 'none' }}>
            Suggest a place →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
          {items.map(l => <ListingCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  );
}

function JatraCard({ jatra }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px 18px',
      flexShrink: 0,
      width: 280,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          fontSize: 24, background: '#fff7ed', width: 44, height: 44,
          borderRadius: 10, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>{jatra.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary-dk)', lineHeight: 1.3 }}>
            {jatra.name}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--accent)', fontWeight: 600,
            marginTop: 3, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            🗓 {jatra.season}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 8px' }}>
        {jatra.description}
      </p>
      <div style={{ fontSize: 11, color: '#9ca3af' }}>
        📍 {jatra.location}{jatra.ward ? ` · Ward ${jatra.ward}` : ''}
      </div>
    </div>
  );
}

export default function ThingsToDoPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/listings?verified=true')
      .then(r => r.json())
      .then(data => { setListings(data.data || []); setLoading(false); })
      .catch(() => { setError('Could not load listings.'); setLoading(false); });
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dk) 0%, var(--primary) 100%)',
        color: 'white', padding: '48px 20px 40px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Things to Do in Kirtipur
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          Ancient temples, Newari feasts, hilltop views and living festivals — discover what makes this hilltop town special.
        </p>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading…</div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>{error}</div>
        )}

        {!loading && !error && (
          <>
            {SECTIONS.map(section => (
              <ListingsSection key={section.key} section={section} listings={listings} />
            ))}

            {/* Jatras section */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 20, background: '#fff7ed',
                      width: 40, height: 40, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>🎪</span>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-dk)', margin: 0 }}>Jatras & Festivals</h2>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 0 50px' }}>
                    Kirtipur's living calendar of Newari festivals, processions and celebrations
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
                {JATRAS.map(j => <JatraCard key={j.name} jatra={j} />)}
              </div>

              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
                * Festival dates follow the lunar Nepali calendar and vary each year.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
