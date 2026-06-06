import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.png" alt="Hamro Kirtipur" className="navbar-logo" />
        <span className="navbar-name">Hamro <span>Kirtipur</span></span>
      </Link>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Map</NavLink>
        <NavLink to="/wards" className={({ isActive }) => isActive ? 'active' : ''}>Wards</NavLink>
        <NavLink to="/suggest" className={({ isActive }) => isActive ? 'active' : ''}>Suggest a place</NavLink>
      </div>
    </nav>
  );
}
