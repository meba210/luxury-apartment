import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Apartments from './pages/Apartments'
import About from './pages/About'
import Contact from './pages/Contact'
import PartnerRegister from './pages/PartnerRegister'
import PartnerLogin from './pages/PartnerLogin'
import PartnerDashboard from './pages/PartnerDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
