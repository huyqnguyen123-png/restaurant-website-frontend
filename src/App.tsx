import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuDetail from './pages/MenuDetail'
import Cart from './pages/Cart'
import CartSuccess from './pages/CartSuccess'
import ReservationPage from './pages/Reservation'
import ReservationSuccess from './pages/ReservationSuccess'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import { CartProvider } from './context/CartContext'
import { MenuNavProvider } from './context/MenuNavContext'

function RedirectToOrderItem() {
  const { id } = useParams()
  return <Navigate to={`/order/${id}`} replace />
}

function App() {
  return (
    <CartProvider>
      <MenuNavProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu mode="view" />} />
              <Route path="/order" element={<Menu mode="order" />} />
              <Route path="/order/:id" element={<MenuDetail />} />
              {/* Old item links (/menu/5) now live under /order */}
              <Route path="/menu/:id" element={<RedirectToOrderItem />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/cart/success" element={<CartSuccess />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/reservation/success" element={<ReservationSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MenuNavProvider>
    </CartProvider>
  )
}

export default App