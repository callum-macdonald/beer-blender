import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const CopyToClipboardText = () => {
  const textToCopy = "0xaa1b85D37d2356b75A920f67494ce9Bb5107457E";

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button onClick={handleClick}>
      <Typography variant="body1" 
        sx={{
            backgroundColor: '#dde',
            borderRadius: '8px',
            padding: '8px',
            marginTop: "-20px",
            marginBottom: "-20px",
            fontSize: 10,
          }}
      ><strong>{textToCopy}</strong></Typography>
    </Button>
  );
};

const CashAppPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Image 
        width={17}
        height={17}
        src="/ethereum.svg" 
        alt="ETH Logo" 
        onClick={openPopup} 
        style={{cursor: 'pointer', opacity:"0.5"}}
      />

      {isOpen && (
        <div style={overlayStyles} onClick={closePopup}>
          <div style={popupStyles} onClick={e => e.stopPropagation()}>
          <p style={{marginTop:"2px", marginBottom:"20px" }}>Donate to API fees 😁</p>
            <Image 
            width={220}
            height={220}
            src="/eth_address.png" 
            alt="QR Code" 
            />
            <Link href="https://etherscan.io/address/0xaa1b85d37d2356b75a920f67494ce9bb5107457e" target="_blank" color="primary" underline="none" marginTop="13px"><strong>Ethereum Address</strong></Link>
            
            <p><strong><CopyToClipboardText /></strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'opacity 1s ease',
  zIndex: 2,
};

const popupStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '260px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 1s ease',
    transform: 'scale(1)',
    textAlign: 'center',
  };
  

export default CashAppPopup;
