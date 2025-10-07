import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../App';

const SERVER_URL = 'http://localhost:4000/';

function Filters({carBrands}) {
    const { setFilters } = useContext(TokenContext);

    const setCarBrand = (e, carBrand) => {
        setFilters({carBrand: e.target.checked ? carBrand : undefined});
    }

    return (
        <div style={styles.container}>
           {carBrands.map(b => (
            <div key={b.id}>
        <input 
            type="checkbox"  
            onClick={(e) => setCarBrand(e, b)}
        />
        <label for="vehicle1">{b}</label><br></br>
            </div>
        ))}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #ddd',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heading: {
        fontSize: '3em', 
        color: '#333', 
        marginBottom: '0',
        cursor: 'pointer',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        transition: 'color 0.3s ease, text-shadow 0.3s ease', 
    },
    buttonsContainer: {
        display: 'flex',
    },
    button: {
        marginLeft: '10px',
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#008000',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};


export default Filters;