import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Welcome from './pages/Welcome'
import EmployeeLogin from './pages/EmployeeLogin'
import HrPortal from './pages/HrPortal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/hr" element={<HrPortal />} />
        <Route path="/hr/login" element={<HrPortal />} />
        <Route path="/hr/new" element={<HrPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
