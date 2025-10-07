import React, { createContext, useEffect, useMemo, useState } from 'react';
import Login from './components/login';
import TopLayout from './components/topLayout';
import AllProductsList from './components/products';
import Order from './components/order';
import Filters from './components/filters';
import ThankYou from './components/ThankYou';
import BlackbookManager from './components/BlackbookManager';

export const TokenContext = createContext({});

function App() {
  const [token, setToken] = useState('');
  const [email, setEmailState] = useState('');
  const [isMainPage, setisMainPage] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [filters, setFilters] = useState({ carBrand: undefined });
  const [isPaid, setIsPaid] = useState(false);
  const [order, setOrder] = useState({ id: '', products: [], address: {}, price: 0 });
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'order', 'blackbook'

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || '';
    const savedEmail = localStorage.getItem('email') || '';
    setToken(savedToken);
    setEmailState(savedEmail);
  }, []);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      email,
      setEmailState,
      isMainPage,
      setisMainPage,
      productsList,
      setProductsList,
      filters,
      setFilters,
      order,
      setOrder,
      isPaid,
      setIsPaid,
      currentPage,
      setCurrentPage,
    }),
    [token, email, isMainPage, productsList, filters, order, isPaid, currentPage]
  );

  const carBrands = useMemo(() => {
    if (!Array.isArray(productsList)) return [];
    const unique = Array.from(new Set(productsList.map((p) => p.carBrand).filter(Boolean)));
    return unique;
  }, [productsList]);

  const backgrounds = useMemo(() => ({
    main: '#fff4e6',
    order: '#e6f7ff', // light blue for page 2
    thankyou: '#e8ffef' // light green for page 3
  }), []);

  return (
    <TokenContext.Provider value={contextValue}>
      {token ? (
        isPaid ? (
          <div style={{ minHeight: '100vh', background: backgrounds.thankyou, position: 'relative' }}>
            <TopLayout />
            <ThankYou />
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '6px 0', textAlign: 'center', color: '#111827', fontSize: '12px', opacity: 0.95, background: 'rgba(255,255,255,0.6)', zIndex: 9999 }}>Terms and Conditions © 2025</div>
          </div>
        ) : (
          <div style={{ minHeight: '100vh', background: currentPage === 'main' ? backgrounds.main : currentPage === 'order' ? backgrounds.order : '#f8f9fa', position: 'relative' }}>
            <TopLayout />
            {currentPage === 'main' && (
              <div>
                <Filters carBrands={carBrands} />
                <AllProductsList />
              </div>
            )}
            {currentPage === 'order' && <Order />}
            {currentPage === 'blackbook' && <BlackbookManager />}
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '6px 0', textAlign: 'center', color: '#111827', fontSize: '12px', opacity: 0.95, background: 'rgba(255,255,255,0.6)', zIndex: 9999 }}>Terms and Conditions © 2025</div>
          </div>
        )
      ) : (
        <Login />
      )}
    </TokenContext.Provider>
  );
}

export default App;
