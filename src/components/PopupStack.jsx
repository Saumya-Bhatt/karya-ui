import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/joy';

function Popup({ message, type, onRemove }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out after 4 seconds
    const fadeTimer = setTimeout(() => setVisible(false), 4000);

    // Remove after fade-out completes (5 seconds total)
    const removeTimer = setTimeout(onRemove, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onRemove]);

  return (
    <Box
      sx={{
        marginBottom: '10px',
        backgroundColor:
          type === 'success'
            ? 'rgba(34, 197, 94, 0.9)' // Green for success
            : 'rgba(255, 69, 0, 0.9)', // Orangish red for warning
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      <Typography>{message}</Typography>
    </Box>
  );
}

function PopupStack({ popups, onRemove }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {popups.map((popup, index) => (
        <Popup
          key={index}
          message={popup.message}
          type={popup.type}
          onRemove={() => onRemove(index)}
        />
      ))}
    </Box>
  );
}

export default PopupStack;
