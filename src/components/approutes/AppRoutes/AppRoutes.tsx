import { Routes, Route, Navigate } from 'react-router-dom'
import Profiles from '../../Profiles'
import { SaasClassic } from '../../SaasClassic/SaasClassic'
import { AppDetail } from '../../SaasClassic/AppDetail'

export function AppRoutes() {
  return (
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
      <Route path="/saas-classic" element={<SaasClassic />} />
      <Route path="/saas-classic/:appId" element={<AppDetail />} />
      <Route path="*" element={<Navigate to="/profiles" replace />} />
    </Routes>
  )
}
