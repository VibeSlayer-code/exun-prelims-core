import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Knowledge from './pages/Knowledge';
import Map from './pages/Map';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            padding: '16px',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#8654d8',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #8654d8',
            }
          },
          error: {
            style: {
              border: '1px solid #d85454',
            }
          }
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
      </Routes>
    </Router>
  );
}

export default App;