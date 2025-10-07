import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../App';

const SERVER_URL = 'http://localhost:4000/';

function TopLayout() {
    const { setToken, setisMainPage, isMainPage, setCurrentPage, currentPage } = useContext(TokenContext);

    const handleLogout = () => {
        setToken('');
        localStorage.setItem('token', '');
        setisMainPage(true);
        setCurrentPage('main');
    }

    const changePage = async () => {
        setisMainPage(!isMainPage);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (page === 'main') {
            setisMainPage(true);
        } else if (page === 'cart') {
            setisMainPage(false);
        }
    }

    useEffect(() => {
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.brandRow}>
                <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true" style={{marginRight: '10px'}}>
                    <circle cx="32" cy="32" r="30" fill="#102a43" />
                    <path d="M16 36 L28 20 L36 32 L48 24" stroke="#fff" strokeWidth="4" fill="none" />
                    <circle cx="28" cy="44" r="4" fill="#f6ad55" />
                    <circle cx="44" cy="44" r="4" fill="#68d391" />
                </svg>
                {isMainPage === false ? (
                    <h1 style={styles.heading} onClick={changePage}>AUTOKART</h1>
                    ) : (
                        <h1 style={styles.heading}>AUTOKART</h1> )}
            </div>
            <div style={styles.buttonsContainer}>
                <button 
                    style={{
                        ...styles.button,
                        backgroundColor: currentPage === 'main' ? '#68d391' : '#f6ad55',
                        marginRight: '10px'
                    }} 
                    onClick={() => handlePageChange('main')}
                >
                    Products
                </button>
                <button 
                    style={{
                        ...styles.button,
                        backgroundColor: currentPage === 'cart' ? '#68d391' : '#f6ad55',
                        marginRight: '10px'
                    }} 
                    onClick={() => handlePageChange('cart')}
                >
                    Cart
                </button>
                <button 
                    style={{
                        ...styles.button,
                        backgroundColor: currentPage === 'blackbook' ? '#68d391' : '#f6ad55',
                        marginRight: '10px'
                    }} 
                    onClick={() => handlePageChange('blackbook')}
                >
                    Blackbook
                </button>
                <button style={styles.button} onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        background: 'linear-gradient(90deg, rgba(16,42,67,0.85), rgba(16,42,67,0.7))',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff'
    },
    brandRow: {
        display: 'flex',
        alignItems: 'center',
    },
    heading: {
        fontSize: '2.2em', 
        color: '#fff', 
        marginBottom: '0',
        cursor: 'pointer',
        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
        transition: 'opacity 0.3s ease', 
    },
    buttonsContainer: {
        display: 'flex',
    },
    button: {
        marginLeft: '10px',
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#f6ad55',
        color: '#102a43',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};


export default TopLayout;