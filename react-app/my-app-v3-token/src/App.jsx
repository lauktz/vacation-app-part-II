import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/Context'
import NavBar from './components/NavBar/NavBar'

import Home from './pages/Home'
import About from './pages/About'
import Vacations from './pages/Vacations'
import AddVacation from './pages/AddVacation'
import EditVacation from './pages/EditVacation'
import Login from './components/Login/Login'
import Register from './components/Register/Register'


import { useUser } from './contexts/Context'

function AppRoutes() {
  const { isAdmin } = useUser();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/vacations" element={<Vacations />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {isAdmin && <Route path="/add-vacation" element={<AddVacation />} />}
      {isAdmin && <Route path="/edit-vacation/:id" element={<EditVacation />} />}
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <NavBar />
          <main style={{ padding: '20px' }}>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
