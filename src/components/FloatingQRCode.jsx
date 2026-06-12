import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import feedbackQrCode from './feedback.png';

const FloatingQRCode = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') return null;

  const initialSize = window.innerWidth * 0.1;
  const rightMargin = 20;
  const initialX = window.innerWidth - initialSize - rightMargin;

  const widget = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 99999
    }}>
      <Rnd
        default={{
          x: initialX,
          y: 20,
          width: initialSize,
          height: initialSize,
        }}
        style={{
          pointerEvents: 'auto'
        }}
        minWidth={50}
        lockAspectRatio={true}
        cancel="a" // Prevents the drag action when clicking the link
      >
        <div style={{
          width: '100%',
          height: '100%',
          userSelect: 'none'
        }}>
          <svg
            viewBox="0 0 100 120"
            style={{ width: '100%', height: '100%', display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <image
              href={feedbackQrCode}
              x="0"
              y="0"
              width="100"
              height="100"
            />
            {/* The anchor tag wraps the text element */}
            <a href="https://bit.ly/43uTQOM" target="_blank" rel="noopener noreferrer">
              <text
                x="50"
                y="115"
                textAnchor="middle"
                fontSize="10"
                fontFamily="sans-serif"
                fill="#0000EE" // Standard link blue
                textDecoration="underline"
                cursor="pointer" // Changes the cursor to a hand on hover
              >
                Feedback bit.ly/43uTQOM
              </text>
            </a>
          </svg>
        </div>
      </Rnd>
    </div>
  );

  return createPortal(widget, document.body);
};

export default FloatingQRCode;