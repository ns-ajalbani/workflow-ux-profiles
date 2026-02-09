import { Topbar } from './components/layout/Topbar/Topbar'
import { Sidebar } from './components/layout/Sidebar/Sidebar'
import { AppRoutes } from './components/approutes/AppRoutes/AppRoutes'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Topbar />

      <div className="main-layout">
        <Sidebar />

        <main className="content">
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}

export default App
