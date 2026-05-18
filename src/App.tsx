import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import MenuPage from './Pages/MenuPage';
import CheckoutPage from './Pages/CheckoutPage';
import DashboardPage from './Pages/DashBoard';
import { CartProvider } from './contexts/CartContext';
import { OrdersProvider } from './contexts/OrdersContext';

const App: React.FC = () => (
  <CartProvider>
    <OrdersProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </Router>
    </OrdersProvider>
  </CartProvider>
);

export default App;
