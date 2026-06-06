export const CATEGORIES = [
  { key: 'health',        label: 'Health',        icon: '🏥', colorClass: 'cat-health',       markerColor: '#e67e22' },
  { key: 'education',     label: 'Education',     icon: '🎓', colorClass: 'cat-education',    markerColor: '#2563eb' },
  { key: 'water',         label: 'Water',         icon: '💧', colorClass: 'cat-water',        markerColor: '#0891b2' },
  { key: 'garbage',       label: 'Garbage',       icon: '♻️', colorClass: 'cat-garbage',      markerColor: '#16a34a' },
  { key: 'emergency',     label: 'Emergency',     icon: '🚨', colorClass: 'cat-emergency',    markerColor: '#9333ea' },
  { key: 'business',      label: 'Business',      icon: '🏪', colorClass: 'cat-business',     markerColor: '#7c3aed' },
  { key: 'ward-office',   label: 'Ward Office',   icon: '🏛️', colorClass: 'cat-wardoffice',   markerColor: '#1a6b4a' },
  { key: 'restaurant',    label: 'Restaurant',    icon: '🍽️', colorClass: 'cat-restaurant',   markerColor: '#dc2626' },
  { key: 'gym',           label: 'Gym',           icon: '💪', colorClass: 'cat-gym',          markerColor: '#475569' },
  { key: 'futsal',        label: 'Futsal',        icon: '⚽', colorClass: 'cat-futsal',       markerColor: '#15803d' },
  { key: 'mart',          label: 'Mart',          icon: '🛒', colorClass: 'cat-mart',         markerColor: '#0e7490' },
  { key: 'gift-shop',     label: 'Gift Shop',     icon: '🎁', colorClass: 'cat-giftshop',     markerColor: '#be185d' },
  { key: 'temple',        label: 'Temple',        icon: '🛕', colorClass: 'cat-temple',       markerColor: '#b91c1c' },
  { key: 'gumba',         label: 'Gumba',         icon: '🙏', colorClass: 'cat-gumba',        markerColor: '#b45309' },
  { key: 'stupa',         label: 'Stupa',         icon: '⛩️', colorClass: 'cat-stupa',        markerColor: '#a16207' },
  { key: 'swimming-pool', label: 'Swimming Pool', icon: '🏊', colorClass: 'cat-pool',         markerColor: '#0284c7' },
  { key: 'club',          label: 'Club',          icon: '🤝', colorClass: 'cat-club',         markerColor: '#7e22ce' },
];

export const getCategoryInfo = (key) =>
  CATEGORIES.find((c) => c.key === key) || { label: key, icon: '📍', colorClass: '', markerColor: '#888' };
