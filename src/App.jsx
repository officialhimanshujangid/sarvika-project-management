import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Layout from './layout/Layout'
import 'react-quill/dist/quill.snow.css';

function App() {


  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<PrivateRoute element={<Layout />} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
