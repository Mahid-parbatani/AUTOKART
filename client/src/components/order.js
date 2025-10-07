import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../App';
import Address from './address'
const SERVER_URL = 'http://localhost:4000/';

function Order() {

    const { token } = useContext(TokenContext);
    const { order } = useContext(TokenContext);
    const { email } = useContext(TokenContext);
    const { setOrder } = useContext(TokenContext);
    const { isPaid } = useContext(TokenContext);
    const { setIsPaid } = useContext(TokenContext);
    const { productsList } = useContext(TokenContext);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');


    const handleOpenModal = (text) => {
        setModalText(text);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000); 
    };

    // const renderProductNames = () => {
    //     return (
    //       <div>
    //         <h1>Ordered Items</h1>
    //         {Object.values(order.products).map(productId => {
    //           const product = Object.values(productsList).find(item => item._id === productId);
    //           if (product) {
    //             return <h2 key={product._id} style={getStyle().orderedItem}>{product.name}</h2>;
    //           }
    //           return null;
    //         })}
    //       </div>
    //     );
    //   };

    const renderProductNames = () => {
      return (
        <div style={getStyle().containerRender}>
          <h1>Ordered Items</h1>
          <div style={getStyle().productList}>
            {Object.values(order.products).map(productId => {
              const product = Object.values(productsList).find(item => item._id === productId);
              if (product) {
                return (
                  <div key={product._id} style={getStyle().productItem}>
                    <h2 style={getStyle().productName}>{product.name}</h2>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    };
    

    useEffect(() => {
        renderProductNames();

    }, []);

     const createOrder = async () => {
        try {
            if (!order.products || order.products.length === 0) {
              const msg = 'Add at least one product first';
              setStatusMessage(msg);
              handleOpenModal(msg);
              return;
            }
            if (!order.address || !order.address.city) {
              const msg = 'Add your address first';
              setStatusMessage(msg);
              handleOpenModal(msg);
              return;
            }

            setStatusMessage('Creating order...');
            const response = await axios.post(
              SERVER_URL + 'order',
              {
                email: email,
                productsList: order.products,
                address: order.address,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            setOrder(prevState => ({
                ...prevState,
                id: response.data._id,
                price: response.data.price
            }))
            setIsOrderCreated(true)
            setIsPaid(false)
            setStatusMessage('Order created successfully');

        } catch (error) {
            const serverMsg = error?.response?.data?.message || 'Error creating order';
            setStatusMessage(serverMsg);
            handleOpenModal(serverMsg);
            console.error('Error creating order:', error?.response?.data || error);
        }
    };

    const realizeOrder = async () => {
        try {
            setStatusMessage('Processing payment...');
            const response = await axios.post(
              SERVER_URL + 'order/realizeOrder',
              { id: order.id },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setIsPaid(true);
            setStatusMessage('Payment successful. Order realized.');

        } catch (error) {
            const serverMsg = error?.response?.data?.message || 'Payment/realize failed';
            setStatusMessage(serverMsg);
            handleOpenModal(serverMsg);
            console.error('Error realizing order:', error?.response?.data || error);
        }
    };

return (
  <div style={getStyle().container}>
    {isOrderCreated ? (
      <div style={getStyle().orderContainer}>
        {isPaid ? (
          <div style={getStyle().orderPaid}>
            <h2>Order Paid</h2>
            <h2>Thanks for shopping</h2>
          </div>
        ) : (
          <div style={getStyle().orderPaid}>
            <h2>Price To Pay</h2>
            <h3>{`$ ${order.price}`}</h3>
            <div style={getStyle().paymentRow}>
              <label style={getStyle().payOption}>
                <input type="radio" name="pay" defaultChecked />
                <svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true" style={getStyle().paySvg}>
                  <rect x="0" y="0" width="64" height="24" rx="4" fill="#1A1F71" />
                  <text x="10" y="17" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="14" fill="#ffffff">VISA</text>
                </svg>
                <span>Visa</span>
              </label>
              <label style={getStyle().payOption}>
                <input type="radio" name="pay" />
                <svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true" style={getStyle().paySvg}>
                  <rect x="0" y="0" width="64" height="24" rx="4" fill="#ffffff" />
                  <circle cx="28" cy="12" r="8" fill="#EB001B" />
                  <circle cx="36" cy="12" r="8" fill="#F79E1B" />
                </svg>
                <span>Mastercard</span>
              </label>
              <label style={getStyle().payOption}>
                <input type="radio" name="pay" />
                <svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true" style={getStyle().paySvg}>
                  <rect x="0" y="0" width="64" height="24" rx="4" fill="#ffffff" />
                  <text x="8" y="17" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="14" fill="#003087">PayPal</text>
                </svg>
                <span>PayPal</span>
              </label>
            </div>
            <button style={getStyle().createOrderButton} onClick={realizeOrder}>Pay for order</button>
          </div>
        )}
      </div>
    ) : (
      <div style={getStyle().orderedItemsAndAddress}>
        {renderProductNames()}
        <Address />
        <button style={getStyle().createOrderButton} onClick={createOrder}>Create Order</button>
      </div>
    )}

    <h3>{modalText}</h3>
    {statusMessage ? <div style={{ marginTop: '10px', color: '#333' }}>{statusMessage}</div> : null}
  </div>
);
   
}
const getStyle = () => ({
  productName: {
    fontSize: '1.8em',
    marginBottom: '10px',
    color: '#333',
    textDecoration: 'none',
  },
  productList: {
    width: '100%',
    maxWidth: '800px',
    padding: 0,
    listStyle: 'none',
    marginLeft: 'auto',
    marginRight: 'auto',
    margin: 0,
  },
  productItem: {
    width: '100%',
    maxWidth: '800px',
    border: '1px solid rgba(16,42,67,0.1)',
    borderRadius: '15px',
    marginBottom: '20px',
    padding: '16px',
    boxShadow: '0 8px 18px rgba(16,42,67,0.15)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  containerRender: {
    marginTop: 0,
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
  },
  orderedItemsContainer: {
    marginBottom: '20px',
    marginTop: '10px', 
    textAlign: 'center',
    marginBottom: '20px',
  },
  orderedItemsContainer1 : {
    marginBottom: '20px',
    marginTop: '20px', 
    textAlign: 'center',
    marginBottom: '0',
  },
  orderPaid: {
    marginBottom: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  createOrderButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px',
    marginBottom: '10px',
  },
  createOrderButtonHover: {
    backgroundColor: '#0056b3',
  },
  paymentRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px'
  },
  payOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(16,42,67,0.1)',
    borderRadius: '20px',
    padding: '6px 10px'
  },
  payIcon: {
    fontSize: '16px'
  },
  paySvg: {
    display: 'block'
  },
  orderedItemsAndAddress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: '20px',
    width: '100%',
    maxWidth: '900px',
    textAlign: 'center',
  },
  orderedItem: { 
    margin: '5px 0',
    textAlign: 'center',
  },
});


export default Order;