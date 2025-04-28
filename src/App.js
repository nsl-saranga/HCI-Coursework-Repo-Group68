import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import AboutUsPage from './Pages/About/About';
import ProductDetailsPage from './Pages/ProductsDetails/ProductsDetails';
import CartPage from './Pages/CartPage/CartPage';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage';
import LoginPage from './Pages/Login/Login';
import SignupPage from './Pages/Signup/Signup';
import { CartProvider } from './context/CartContext';
import OrderConfirmationPage from './Pages/OrderConfirmationPage/OrderConfirmationPage';
import OrdersTrackingPage from './Pages/OrdersTrackingPage/OrdersTrackingPage';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <div id='page-body'>
            <Routes>
              <Route path='/' element={<HomePage/>} />
              <Route path='/about' element={<AboutUsPage/>} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/orders" element={<OrdersTrackingPage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/register" element={<SignupPage/>} />
              <Route path="*" element={<NotFoundPage />} />
              {/* Uncomment these when ready */}
              {/* <Route path='/:productType' element={<ProductsPage/>} />
              <Route path='/:product/details' element={<ViewProductsPage/>} />
              <Route path='/search' element={<SearchedProductsPage />} />
              <Route path='/login' element={<LoginPage/>} />
              <Route path='/register' element={<RegisterPage/>} />
              <Route path='*' element={<NotFoundPage/>} /> */}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;