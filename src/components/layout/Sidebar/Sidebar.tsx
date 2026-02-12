import { NavLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/policies"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          Policies
        </NavLink>
        <NavLink
          to="/profiles"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          Profiles
        </NavLink>
        <NavLink
          to="/saas-classic"
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          SaaS (Classic)
        </NavLink>
      </nav>
    </aside>
  )
}
