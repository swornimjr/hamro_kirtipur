# KirtipurMap — Local Directory

Searchable map of services, ward offices, health posts, schools, water points, and emergency contacts for Kirtipur Municipality.

## Tech Stack
- **MongoDB** — database for listings, wards, emergency contacts
- **Express.js** — REST API server
- **React** — frontend (Create React App)
- **Node.js** — server runtime
- **React-Leaflet + OpenStreetMap** — free map (no API key needed)
- **Axios** — API calls from client

---

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a free MongoDB Atlas cluster)

### 1. Clone and install
```bash
git clone <your-repo>
cd kirtipur-directory
npm run install-all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# Edit server/.env — add your MONGO_URI if using Atlas
```

### 3. Seed the database with starter data
```bash
cd server
node data/seed.js
```

### 4. Run in development (both server + client together)
```bash
cd ..   # back to root
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## API Endpoints

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | All listings. Query: `?category=health&ward=3&search=hospital` |
| GET | `/api/listings?lat=27.67&lng=85.28&radius=1000` | Nearby listings within radius (metres) |
| GET | `/api/listings/:id` | Single listing detail |
| POST | `/api/listings/suggest` | Public suggestion (unverified) |
| POST | `/api/listings` | Create listing (admin) |
| PUT | `/api/listings/:id` | Update listing (admin) |
| DELETE | `/api/listings/:id` | Delete listing (admin) |

### Wards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wards` | All 11 wards (no boundary polygons) |
| GET | `/api/wards/:number` | Ward detail with boundary |
| POST | `/api/wards` | Create/update ward (admin) |

### Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emergency` | All emergency contacts |
| POST | `/api/emergency` | Add contact (admin) |

---

## Adding ward boundaries (GeoJSON)
1. Go to https://overpass-turbo.eu
2. Run: `relation["name"="Kirtipur"]; out geom;`
3. Export as GeoJSON
4. For each ward, PUT to `/api/wards/:number` with the boundary polygon

---

## Deployment
- **Frontend:** Deploy `client/build` to Vercel or Netlify (free)
- **Backend:** Deploy to Railway, Render, or a VPS (DigitalOcean ~$6/mo)
- **Database:** MongoDB Atlas free tier (512MB, more than enough to start)

---

## Adding Nepali language (future)
- Install `i18next` and `react-i18next`
- Create `client/src/locales/ne.json` with Nepali translations
- Toggle via a language switcher in the Navbar

---

## Categories
- `health` — Health posts, hospitals, clinics
- `education` — Schools, colleges, TU faculties
- `water` — Public water taps, stone spouts (dhara)
- `garbage` — Garbage collection points/routes
- `emergency` — Police, fire, ambulance (also in EmergencyStrip)
- `business` — Local shops, markets
- `ward-office` — Ward offices and municipality
