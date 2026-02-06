import { useState } from 'react'
import Profiles from './components/Profiles'
import './App.css'

function App() {
  const [activeMenu, setActiveMenu] = useState<'policies' | 'profiles'>('profiles')

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
            <button
              className={`menu-item ${activeMenu === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveMenu('policies')}
            >
              Policies
            </button>
            <button
              className={`menu-item ${activeMenu === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profiles')}
            >
              Profiles
            </button>
          </nav>
        </aside>

        <main className="content">
          {activeMenu === 'policies' && (
            <div className="page-content">
              <h2>Policies</h2>
              <p>Manage your workflow policies here.</p>
            </div>
          )}
          {activeMenu === 'profiles' && <Profiles />}
        </main>
      </div>
    </div>
  )
}

export default App
