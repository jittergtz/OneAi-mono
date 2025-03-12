

import React from 'react'

function ButtonSearch(type: any) {
 const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isFilterHovered, setIsFilterHovered] = React.useState(false);
  const [isFilterFocused, setIsFilterFocused] = React.useState(false);
  const [isResultVisible, setIsResultVisible] = React.useState(false);
  const iconColor = '#bcacbd';
  const inputRadius = '14px';

      const filterStyle: React.CSSProperties = {
        zIndex: 3,
        background: 'none',
        fontSize: '27px',
        position: 'absolute',
        right: '7px',
        top: '7px',
        bottom: '7px',
        width: '46px',
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
            background: 'linear-gradient(to bottom, #171725 0%, #0c0a2a 70%, #1b1856 100%)',
            backgroundClip: 'padding-box',
            border: 'solid 2px transparent',
            boxShadow: 'inset 0 3px 3px -3px rgba(0, 0, 0, 0.5)',
          };

           const filterSpanBeforeStyle: React.CSSProperties = {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              margin: '-2px',
              borderRadius: 'inherit',
              background: 'linear-gradient(to bottom, #333161 0%, #0c0a2a 50%, #3d3a75 100%)',
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        strokeWidth="2"
        fill="none"
        stroke={iconColor}
        style={{ transition: 'all 0.2s ease', ...(isFilterHovered ? { transform: 'scale(1.07)'} : {} ), ...(isFilterFocused ? { animation: 'shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both'} : {} )}}
      >
        <path
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
    </span>
  </button>
  )
}

export default ButtonSearch
