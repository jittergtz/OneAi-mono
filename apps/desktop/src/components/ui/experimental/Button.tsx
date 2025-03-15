

import { Send } from 'lucide-react';
import React from 'react'

function ButtonSearch(type: any) {
 const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isFilterHovered, setIsFilterHovered] = React.useState(false);
  const [isFilterFocused, setIsFilterFocused] = React.useState(false);
  const [isResultVisible, setIsResultVisible] = React.useState(false);
  const iconColor = '#FFFFFF70';
  const inputRadius = '14px';

      const filterStyle: React.CSSProperties = {
        zIndex: 3,
        background: 'none',
        fontSize: '27px',
        position: 'absolute',
        right: '6px',
        top: '7px',
        bottom: '7px',
        width: '37px',
        cursor: 'pointer',
        color: iconColor,
        border: 'none',
        overflow: 'hidden',
        borderRadius: `calc(${inputRadius} * 0.9)`,
        transition: 'all 0.2s ease',
        filter: 'brightness(1)', // Hover state handled in JSX with style update
      };

        const filterBeforeStyle: React.CSSProperties = {
          content: '""',
          position: 'absolute',
          width: '200px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(to right, rgba(244, 221, 255, 0.1) 10%, rgba(244, 221, 255, 0.5) 60%, rgba(244, 221, 255, 0.3) 60%, rgba(244, 221, 255, 0.1) 90%)',
          top: '-40%',
          bottom: '-40%',
          left: '-220px',
          zIndex: 1,
          opacity: 0.3,
          transform: 'translateX(0) skew(-30deg)',
          transition: 'all 0.8s cubic-bezier(0.5, 0, 0.3, 1)', // Transition will apply on hover in JSX
        };

          const filterSpanStyle: React.CSSProperties = {
            inset: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
            background: 'linear-gradient(to bottom, #171725 0%, #000 70%, #009278 150%)',
            backgroundClip: 'padding-box',
            border: 'solid 2px transparent',
            boxShadow: 'inset 0 3px 3px -3px rgba(60, 60, 0, 0.5)',
          };

           const filterSpanBeforeStyle: React.CSSProperties = {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              margin: '-1px',
              borderRadius: 'inherit',
              background: 'linear-gradient(to bottom, #2fff 0%, #000 50%, #000 100%)',
            };

    
      const handleInputFocus = () => {
        setIsInputFocused(true);
      };
    
      const handleInputBlur = () => {
        setIsInputFocused(false);
      };
    
      const handleFilterHover = () => {
        setIsFilterHovered(true);
      };
    
      const handleFilterMouseLeave = () => {
        setIsFilterHovered(false);
      };
      const handleFilterFocus = () => {
        setIsFilterFocused(true);
      };
    
      const handleFilterBlur = () => {
        setIsFilterFocused(false);
      };

      

  return (
    <button
    style={{...filterStyle, ...(isFilterHovered ? { filter: 'brightness(1.3)'} : {} )}}
    className="filter"
    onMouseEnter={handleFilterHover}
    onMouseLeave={handleFilterMouseLeave}
    onFocus={handleFilterFocus}
    onBlur={handleFilterBlur}
    type='submit'
  >
    <div style={{...filterBeforeStyle, ...(isFilterHovered ? {transform: 'translate(320px, 0) skew(30deg)' } : {} )}} className="filter:before"></div>
    <span style={filterSpanStyle} className="filter span">
      <div style={filterSpanBeforeStyle} className="filter span::before"></div>
       <Send className='size-4'  />
    </span>
  </button>
  )
}

export default ButtonSearch
