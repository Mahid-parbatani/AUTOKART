import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../App';

const SERVER_URL = 'http://localhost:4000/';

function AllProductsList() {

    const { token, order, setOrder, setisMainPage, isMainPage, productsList, setProductsList, filters } = useContext(TokenContext);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const handleOpenModal = (text) => {
        setModalText(text);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000); 
    };

    useEffect(() => {
         getProducts().then((result) => {
          setFilteredItems(result)
          setProductsList(result)
        })
    }, []);

    useEffect(() => {
        const filteredProducts = filterProductsByCarBrand(filters.carBrand);
        setFilteredItems(filteredProducts)

    }, [filters]);

    const addProductToOrder = async (id)=> {
        const newProducts = [...order.products, id];

        setOrder(prevState => ({
            ...prevState,
            products: newProducts
        }));
        console.log(order.products)

    };
    
    const removeProductFromOrder = (id) => {
      setOrder(prevState => {
        const updated = prevState.products.filter(productId => productId !== id);
        return { ...prevState, products: updated };
      });
      handleOpenModal('Removed from basket');
    };
    
    const changePage = async () => {
        setisMainPage(!isMainPage);
    }

    const getProductBlurb = (product) => {
      if (product && product.description) return product.description;
      const name = (product?.name || 'This part');
      const category = product?.category ? ` ${product.category}` : '';
      return `${name}${category} is selected for reliable performance and fitment. Ideal for quick replacements and routine maintenance.`;
    };

    const resolveLocalImage = (name) => {
      if (!name) return null;
      const key = String(name).toLowerCase().trim();

      // direct exact matches
      const exact = {
        'headlight bulb': '/images/headlight bulb.jpeg',
        'brake pad': '/images/brake pads.jpeg',
        'brake pads': '/images/brake pads.jpeg',
        'oil filter': '/images/oil filter.jpeg',
        'air filter': '/images/air filter.jpeg',
        'spark plug': '/images/spark plug.jpeg',
        'wiper blade': '/images/wiper blades.jpeg',
        'wiper blades': '/images/wiper blades.jpeg',
        'battery terminals': '/images/battery terminals.jpeg',
        'radiator cap': '/images/radiator cap.jpeg',
        'timing belt': '/images/timing belt.jpeg',
        'fuel pump': '/images/fuel pump.jpeg',
        'alternator': '/images/alternator.jpeg',
        'shock absorber': '/images/shock absorber.jpeg',
        'brake disc rotor': '/images/brake disc rotor.jpeg',
      };
      if (exact[key]) return exact[key];

      // substring/keyword based fallbacks
      const rules = [
        { inc: ['headlight', 'bulb'], path: '/images/headlight bulb.jpeg' },
        { inc: ['brake', 'pad'], path: '/images/brake pads.jpeg' },
        { inc: ['oil', 'filter'], path: '/images/oil filter.jpeg' },
        { inc: ['air', 'filter'], path: '/images/air filter.jpeg' },
        { inc: ['spark', 'plug'], path: '/images/spark plug.jpeg' },
        { inc: ['wiper', 'blade'], path: '/images/wiper blades.jpeg' },
        { inc: ['battery', 'terminal'], path: '/images/battery terminals.jpeg' },
        { inc: ['radiator', 'cap'], path: '/images/radiator cap.jpeg' },
        { inc: ['timing', 'belt'], path: '/images/timing belt.jpeg' },
        { inc: ['fuel', 'pump'], path: '/images/fuel pump.jpeg' },
        { inc: ['alternator'], path: '/images/alternator.jpeg' },
        { inc: ['shock', 'absorber'], path: '/images/shock absorber.jpeg' },
        { inc: ['brake', 'disc', 'rotor'], path: '/images/brake disc rotor.jpeg' },
      ];
      for (const rule of rules) {
        if (rule.inc.every(k => key.includes(k))) return rule.path;
      }
      return null;
    };

    const renderProductNames = () => {
      return (
        <div style={getStyle().container}>
          <h1>Items in Cart</h1>
          <div style={getStyle().productList}>
            {Object.values(order.products).map(productId => {
              const product = Object.values(productsList).find(item => item._id === productId);
              if (product) {
                return (
                  <div key={product._id} style={getStyle().productItem} onClick={() => getProductsDetails(product._id)}>
                    <div style={getStyle().thumbWrap}>
                      {(resolveLocalImage(product.name) || product.imageUrl) ? (
                        <img alt={product.name} src={resolveLocalImage(product.name) || product.imageUrl} style={getStyle().thumbImage} />
                      ) : (
                        <div style={getStyle().imagePlaceholder}>No image</div>
                      )}
                    </div>
                    <div style={getStyle().productDetails}>
                      <h2 style={getStyle().productName}>{product.name}</h2>
                      <div style={getStyle().buttonsRow}>
                        <button
                          style={{ ...getStyle().button, backgroundColor: '#dc2626' }}
                          onClick={(e) => { e.stopPropagation(); removeProductFromOrder(product._id); }}
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    };
    
    
    const filterProductsByCarBrand = () => {
      if(!filters.carBrand) {
        console.log(productsList)
        return productsList;
      }

      const filteredProducts = productsList.filter((product) => {
        return product.carBrand === filters.carBrand //&& product.category === filters.category && product.availability === filters.availability
      })
      
      // if filters.map((filter) => filter.carBrand).includes(product.carBrand)
      // filter = {carBrand, availability}
      return filteredProducts;
    }
    // const filterProductsByPrice = (price) => {
    //   const filteredProducts = productsList.filter((product) => {
    //     return product.price === price;
    //   })

    //   setProductsList(filteredProducts)
    // }

    const getProductsList = async () => {
        try {
            const response = await axios.get(SERVER_URL + 'products/', {
              headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductsList(response.data);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    const getProducts = async () => {
      try {
        const response = await axios.get(SERVER_URL + 'products/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching products:', error);
    }
    }

    const getProductsDetails = async (id) => {
        try {
            const response = await axios.get(SERVER_URL + 'products/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductsList(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
   
    const renderProductDetails = () => {
      const p = productsList && !Array.isArray(productsList) ? productsList : null;
      if (!p) {
        return (
          <div style={getStyle().container}>
            <h2 style={getStyle().heading}>Product Details</h2>
            <div>Loading product...</div>
          </div>
        );
      }
      return (
        <div style={getStyle().container}>
          <h2 style={getStyle().heading}>Product Details</h2>
          <div style={getStyle().productItem}>
            <div style={getStyle().detailImageWrap}>
              {(resolveLocalImage(p?.name) || p?.imageUrl) ? (
                <img alt={p?.name || 'product'} src={resolveLocalImage(p?.name) || p?.imageUrl} style={getStyle().detailImage} />
              ) : (
                <div style={getStyle().imagePlaceholder}>No image</div>
              )}
            </div>
            <div style={getStyle().productDetails}>
              <h3 style={getStyle().productName} onClick={() => getProductsList()}>{p?.name || 'Unnamed product'}</h3>
              <p style={getStyle().productPrice}>Price: ${p?.price ?? '—'}</p>
              <p><strong>Car Brand:</strong> {p?.carBrand || '—'}</p>
              <p><strong>Category:</strong> {p?.category || '—'}</p>
              <p><strong>Amount:</strong> {p?.amount ?? '—'}</p>
              <p><strong>Description:</strong> {p?.description || '—'}</p>
              <p style={p?.availability ? getStyle().available : getStyle().unavailable}>Availability: {p?.availability ? 'Available' : 'Not Available'}</p>
            </div>
            {p?.availability ? (
              <div>
                <button style={getStyle().button} onClick={() => { addProductToOrder(p._id); handleOpenModal('Added to basket') }}>Add to basket</button>
                {showModal && (
                  <div>
                    <p>{modalText}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      );
    };
    
    
    const renderProductList = () => {
      const palette = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#e11d48'];
      return (
        <div style={getStyle().container}>
          <h2 style={getStyle().heading} onClick={getProductsList}>Products List</h2>
          <p style={getStyle().projectTagline}>AUTOKART is a simple marketplace for quality used auto parts. Browse, add to your basket, and place an order with a few clicks.</p>
          <ul style={getStyle().productList}>
            {filteredItems.map((product, idx) => {
              const accent = palette[idx % palette.length];
              return (
                <li key={product._id} style={getStyle().productItem}>
                  <div style={getStyle().thumbWrap}>
                    {(resolveLocalImage(product.name) || product.imageUrl) ? (
                      <img alt={product.name} src={resolveLocalImage(product.name) || product.imageUrl} style={getStyle().thumbImage} />
                    ) : (
                      <div style={getStyle().imagePlaceholder}>No image</div>
                    )}
                  </div>
                  <div style={getStyle().productDetails}>
                    <h3 style={{ ...getStyle().productName, color: accent }} onClick={() => getProductsDetails(product._id)}>{product.name}</h3>
                    <p style={{ ...getStyle().productPrice, color: accent }}>Price: ${product.price}</p>
                    <p style={getStyle().blurb}>{getProductBlurb(product)}</p>
                    <p style={{ color: '#0f172a' }}><strong style={{ color: accent }}>Car Brand:</strong> {product.carBrand}</p>
                    <p style={{ color: '#0f172a' }}><strong style={{ color: accent }}>Category:</strong> {product.category}</p>
                    <p style={product.availability ? { ...getStyle().available, color: '#16a34a' } : { ...getStyle().unavailable, color: '#dc2626' }}>Availability: {product.availability ? 'Available' : 'Not Available'}</p>
                    <div style={getStyle().buttonsRow}>
                      <button style={{ ...getStyle().button, backgroundColor: accent }} onClick={() => getProductsDetails(product._id)}>View details</button>
                      {product.availability ? (
                        <button style={{ ...getStyle().button, backgroundColor: '#0ea5e9' }} onClick={() => { addProductToOrder(product._id); handleOpenModal('Added to basket') }}>Add to basket</button>
                      ) : (
                        <button style={{ ...getStyle().button, backgroundColor: '#aaa', cursor: 'not-allowed' }} disabled>Unavailable</button>
                      )}
                    </div>
                    {showModal && (
                      <div>
                        <p style={{ color: accent }}>{modalText}</p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    };


    return (
      <div style={getStyle().container}>
        {Array.isArray(productsList) ? (
          <div>
            {renderProductNames()}
            <button style={getStyle().buttonOrdering} onClick={() => { changePage(); }}>Go To Your Order</button>
            {renderProductList()}
          </div>
        ) : productsList ? (
          renderProductDetails()
        ) : (
          <div>
            <h2 style={getStyle().heading}>Products</h2>
            <div>Loading...</div>
          </div>
        )}
      </div>
    );
}

const getStyle = () => ({
    orderedItem: { 
      margin: '5px 0',
      textAlign: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    heading: {
      fontSize: '2.2em',
      color: '#102a43',
      marginBottom: '30px',
      cursor: 'pointer',
      textAlign: 'center',
    },
    projectTagline: {
      marginTop: '-12px',
      marginBottom: '16px',
      color: '#334155'
    },
    productList: {
      minWidth: '800px',
      padding: 0,
      listStyle: 'none',
      marginLeft: 'auto',
      marginRight: 'auto',
      margin: 0,
    },
    productItem: {
      minWidth: '800px',
      border: '1px solid rgba(16,42,67,0.1)',
      borderRadius: '15px',
      marginBottom: '20px',
      padding: '16px',
      boxShadow: '0 8px 18px rgba(16,42,67,0.15)',
      backgroundColor: 'rgba(255,255,255,0.85)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      backgroundImage: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      flexWrap: 'nowrap',
      textAlign: 'left',
    },
    productDetails: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    thumbWrap: {
      width: '200px',
      height: '150px',
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.06)',
      flex: '0 0 auto',
    },
    thumbImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    detailImageWrap: {
      width: '260px',
      height: '200px',
      borderRadius: '10px',
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.06)',
      flex: '0 0 auto',
    },
    detailImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    imagePlaceholder: {
      width: '200px',
      height: '150px',
      borderRadius: '8px',
      marginTop: '10px',
      backgroundColor: '#eaeaea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888',
      fontSize: '0.9em',
    },
    buttonsRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '12px',
      justifyContent: 'center',
    },
    productName: {
      fontSize: '1.8em',
      marginBottom: '10px',
      color: '#333',
      textDecoration: 'none',
    },
    productPrice: {
      fontWeight: 'bold',
      color: '#008000',
    },
    blurb: {
      color: '#475569',
      margin: '6px 0 8px'
    },
    productAvailability: {
      fontStyle: 'italic',
    },
    available: {
      color: 'green',
    },
    unavailable: {
      color: 'red',
    },
    button: {
      padding: '10px 15px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#008000',
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      textAlign: 'center',
    },
    buttonOrdering: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#008000',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textAlign: 'center',
        marginTop: '10px',
        marginLeft: '42%',
      },
  });


export default AllProductsList;
