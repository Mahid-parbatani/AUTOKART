import React from 'react';

function ThankYou() {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>THANK YOU FOR ORDERING WITH USTOUR ORDER HAS BEEN PLACED</h1>
        <p style={styles.subtitle}>THANKS FOR SHOPPING WITH US PLEASE VISIT US AGAIN</p>
      </div>

      <div style={styles.socialWrap}>
        <div style={styles.contactHeading}>CONTACT US</div>
        <a aria-label="WhatsApp" href="https://wa.me" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
          <svg viewBox="0 0 32 32" width="28" height="28" fill="#25D366" aria-hidden="true">
            <path d="M19.11 17.08c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.2.3-.8.97-.98 1.17-.18.2-.36.22-.66.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.47.13-.62.13-.13.3-.33.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.7-1.69-.96-2.32-.25-.6-.5-.52-.7-.53l-.6-.01c-.2 0-.52.07-.8.37-.28.3-1.1 1.08-1.1 2.64 0 1.56 1.13 3.07 1.29 3.29.16.22 2.24 3.42 5.44 4.78.76.33 1.35.53 1.82.67.76.24 1.46.2 2.01.12.61-.09 1.87-.76 2.13-1.49.26-.73.26-1.35.18-1.49-.08-.14-.27-.22-.57-.37zM26.7 5.3C23.8 2.4 20.06 1 16.05 1 8.51 1 2.39 7.12 2.39 14.66c0 2.36.62 4.67 1.82 6.7L2 31l9.86-2.58c1.96 1.07 4.18 1.63 6.47 1.63h.01c7.54 0 13.66-6.12 13.66-13.66 0-3.63-1.42-7.05-4.1-9.73zM16.34 27.3h-.01c-2.08 0-4.11-.56-5.88-1.62l-.42-.25-5.85 1.53 1.56-5.7-.27-.46c-1.15-1.9-1.77-4.1-1.77-6.34 0-6.82 5.55-12.37 12.37-12.37 3.3 0 6.41 1.28 8.75 3.61 2.34 2.33 3.62 5.45 3.62 8.75 0 6.82-5.55 12.37-12.37 12.37z"/>
          </svg>
        </a>
        <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#E4405F" aria-hidden="true">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1 .4.4.8.9 1 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5-.4.4-.9.8-1.5 1-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.4-.4-.8-.9-1-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.4-.4.9-.8 1.5-1 .5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .1 5.7.2 4.8.3 4 .6c-.9.3-1.7.8-2.4 1.5C.9 2.8.4 3.6.1 4.5.3 5.3.2 6.2.1 7.5 0 8.8 0 9.2 0 12s0 3.2.1 4.5c.1 1.3.2 2.2.4 3 .3.9.8 1.7 1.5 2.4.7.7 1.5 1.2 2.4 1.5.8.3 1.7.5 2.4.6 1.3.1 1.7.1 4.5.1s3.2 0 4.5-.1c.8-.1 1.6-.3 2.4-.6.9-.3 1.7-.8 2.4-1.5.7-.7 1.2-1.5 1.5-2.4.3-.8.5-1.6.6-2.4.1-1.3.1-1.7.1-4.5s0-3.2-.1-4.5c-.1-.8-.3-1.6-.6-2.4-.3-.9-.8-1.7-1.5-2.4-.7-.7-1.5-1.2-2.4-1.5-.8-.3-1.6-.5-2.4-.6C15.2.2 14.8.2 12 .2z"/>
            <circle cx="12" cy="12" r="3.2" fill="#E4405F"/>
          </svg>
        </a>
        <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#1877F2" aria-hidden="true">
            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.494v-9.294H9.691V11.01h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.098 2.795.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.766v2.316h3.588l-.467 3.696h-3.121V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative'
  },
  card: {
    maxWidth: '900px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    textAlign: 'center'
  },
  title: {
    fontSize: '28px',
    lineHeight: 1.3,
    color: '#1f2937',
    margin: 0
  },
  subtitle: {
    marginTop: '10px',
    fontSize: '18px',
    color: '#374151'
  },
  socialWrap: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  contactHeading: {
    fontWeight: '600',
    color: '#1f2937',
    marginRight: '8px'
  },
  iconLink: {
    width: '44px',
    height: '44px',
    background: 'white',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
  }
};

export default ThankYou;


