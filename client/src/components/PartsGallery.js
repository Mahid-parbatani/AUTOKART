import React from 'react';

function PartsGallery() {
  const items = [
    { label: 'headlight bulb', file: 'headlight bulb.jpeg', color: '#fff4e6' },
    { label: 'brake pad', file: 'brake pads.jpeg', color: '#e6f7ff' },
    { label: 'oil filter', file: 'oil filter.jpeg', color: '#e8ffef' },
    { label: 'air filter', file: 'air filter.jpeg', color: '#f3e8ff' },
    { label: 'spark plug', file: 'spark plug.jpeg', color: '#ffe6f1' },
    { label: 'wiper blades', file: 'wiper blades.jpeg', color: '#eef6ff' },
    { label: 'battery terminals', file: 'battery terminals.jpeg', color: '#fffbe6' },
    { label: 'radiator cap', file: 'radiator cap.jpeg', color: '#e6fff6' },
    { label: 'timing belt', file: 'timing belt.jpeg', color: '#f0f0f0' },
    { label: 'fuel pump', file: 'fuel pump.jpeg', color: '#e6ecff' },
    { label: 'alternator', file: 'alternator.jpeg', color: '#e6ffe6' },
    { label: 'shock absorber', file: 'shock absorber.jpeg', color: '#fff0f0' },
    { label: 'brake disc rotor', file: 'brake disc rotor.jpeg', color: '#f7e6ff' },
  ];

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        {items.map((item) => (
          <div key={item.label} style={{ ...styles.card, backgroundColor: item.color }}>
            <div style={styles.imageWrap}>
              <img
                src={`/images/${item.file}`}
                alt={item.label}
                style={styles.image}
                onError={(e) => { e.currentTarget.style.opacity = 0.2; }}
              />
            </div>
            <div style={styles.caption}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: '100%',
    overflowX: 'auto',
    padding: '8px 12px',
  },
  row: {
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch',
    minWidth: '820px',
  },
  card: {
    flex: '0 0 auto',
    width: '180px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  imageWrap: {
    width: '100%',
    height: '120px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'rgba(0,0,0,0.03)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  caption: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#333'
  }
};

export default PartsGallery;


