import React, { useEffect, useState } from 'react';
import { getEmergencyContacts } from '../../utils/api';

const FALLBACK = [
  { name: 'Police', phone: '100' },
  { name: 'Ambulance', phone: '102' },
  { name: 'Fire', phone: '101' },
];

export default function EmergencyStrip() {
  const [contacts, setContacts] = useState(FALLBACK);

  useEffect(() => {
    getEmergencyContacts()
      .then((res) => {
        const top = res.data.data.filter((c) => c.available24h).slice(0, 5);
        if (top.length > 0) setContacts(top);
      })
      .catch(() => {}); // fallback stays
  }, []);

  return (
    <div className="emergency-strip" role="banner" aria-label="Emergency contacts">
      <span style={{ fontWeight: 600, opacity: 0.9 }}>🚨 Emergency:</span>
      {contacts.map((c) => (
        <a key={c.phone} href={`tel:${c.phone}`}>
          {c.name} — {c.phone}
        </a>
      ))}
    </div>
  );
}
