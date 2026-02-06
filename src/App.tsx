import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Profiles from './components/Profiles'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="topbar">
        <div className="topbar-content">
          <div className="logo-section">
            <img
              src="https://webui-qe01-dfw3-mp-prod.goskope.com/UI_Layer/img/favicon/favicon-16.png"
              alt="Netskope"
              className="netskope-logo"
            />
            <span className="logo-text">Netskope</span>
          </div>
        </div>
      </header>

      <div className="main-layout">
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
          </nav>
        </aside>

        <main className="content">
          <Routes>
            <Route
              path="/policies"
              element={
                <div className="page-content">
                  <h2>Policies</h2>
                  <p>Manage your workflow policies here.</p>
                </div>
              }
            />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profiles/:editId" element={<Profiles />} />
            <Route path="*" element={<Navigate to="/profiles" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
