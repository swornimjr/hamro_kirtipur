import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { getCategoryInfo } from '../../utils/categories';

// Fix Leaflet default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Colored circle marker per category
function createColoredIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px; height:28px; border-radius:50%;
      background:${color}; border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      display:flex; align-items:center; justify-content:center;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// Disable scroll zoom until user clicks the map; re-disable on mouse leave
function ScrollZoomControl({ active, onActivate }) {
  const map = useMap();
  useEffect(() => {
    if (active) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [active, map]);

  useEffect(() => {
    const container = map.getContainer();
    const handleLeave = () => onActivate(false);
    container.addEventListener('mouseleave', handleLeave);
    return () => container.removeEventListener('mouseleave', handleLeave);
  }, [map, onActivate]);

  return null;
}

// Fly to user location
function LocateButton() {
  const map = useMap();
  const locate = () => {
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', (e) => {
      L.marker(e.latlng).addTo(map).bindPopup('You are here').openPopup();
    });
  };
  return (
    <div
      onClick={locate}
      title="Find my location"
      style={{
        position: 'absolute', bottom: 90, right: 10, zIndex: 1000,
        background: 'white', border: '1px solid #e5e7eb',
        borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
        fontSize: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      📍
    </div>
  );
}

const KIRTIPUR_CENTER = [27.6774, 85.2801];

export default function DirectoryMap({ listings }) {
  const [scrollActive, setScrollActive] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onClick={() => setScrollActive(true)}
    >
      {!scrollActive && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.55)', color: 'white',
            padding: '8px 16px', borderRadius: 20,
            fontSize: 13, fontWeight: 500,
          }}>
            Click to interact with the map
          </div>
        </div>
      )}
    <MapContainer
      center={KIRTIPUR_CENTER}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '520px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ScrollZoomControl active={scrollActive} onActivate={setScrollActive} />
      <LocateButton />
      {listings.map((listing) => {
        const [lng, lat] = listing.location.coordinates;
        const catInfo = getCategoryInfo(listing.category);
        return (
          <Marker
            key={listing._id}
            position={[lat, lng]}
            icon={createColoredIcon(catInfo.markerColor)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {catInfo.icon} {listing.name}
                </div>
                {listing.address && (
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    📍 {listing.address}
                  </div>
                )}
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} style={{ fontSize: 12, color: '#1a6b4a' }}>
                    📞 {listing.phone}
                  </a>
                )}
                <br />
                <Link
                  to={`/listing/${listing._id}`}
                  style={{ fontSize: 12, color: '#1a6b4a', fontWeight: 500 }}
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
    </div>
  );
}
