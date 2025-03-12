import React from 'react';

const UiverseSearchComponent: React.FC = () => {
  const easeElastic = 'cubic-bezier(0.7, -0.5, 0.3, 1.5)';
  const iconColor = '#bcacbd';
  const glowLColor = '#8422b1';
  const glowRColor = '#0d00ff';
  const inputRadius = '14px';
  const resultItemH = '33.5px';

  const containerStyle: React.CSSProperties = {
    '--ease-elastic': easeElastic,
    '--icon-color': iconColor,
    '--glow-l-color': glowLColor,
    '--glow-r-color': glowRColor,
    '--input-radius': inputRadius,
    '--result-item-h': resultItemH,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1, // Animation removed for inline style, set opacity to 1 for visibility
    // animation: 'fadeIn 1.4s ease forwards 0.2s', // Animation - Not directly inlineable, consider CSS modules or styled-components for animations
  };

  const bgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    maskImage: 'linear-gradient(to right, transparent 0%, black 40%, black 60%, transparent 100%)',
  };

  const bgBeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    inset: 0,
    margin: 'auto',
    width: '100%',
    height: '400px',
    backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '12px 12px',
    maskImage: 'linear-gradient(transparent 0%, black 40%, black 60%, transparent 100%)',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#010201',
    borderRadius: inputRadius,
    position: 'relative',
    zIndex: 10,
  };

  const inputBeforeStyle: React.CSSProperties = {
    pointerEvents: 'none',
    content: '"type to interact"',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '95px',
    fontSize: '18px',
    margin: 'auto',
    textAlign: 'center',
    fontWeight: 'lighter',
    opacity: 0.4,
    color: 'white',
    maskImage: 'linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, white 100%)',
  };

  const reflectionStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 9,
    borderRadius: inputRadius,
    pointerEvents: 'none',
    overflow: 'hidden',
  };

  const reflectionBeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    background: 'linear-gradient(to right, rgba(244, 221, 255, 0.1) 10%, rgba(244, 221, 255, 0.5) 60%, rgba(244, 221, 255, 0.3) 60%, rgba(244, 221, 255, 0.1) 90%)',
    top: 0,
    bottom: 0,
    opacity: 0.3,
    transform: 'translateX(-540px) skew(-40deg)',
    transition: 'all 1.2s cubic-bezier(0.5, 0, 0.3, 1)', // Transition will apply on focus-within in JSX
  };

  const reflectionAfterStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    left: '68px',
    right: '50%',
    top: '10px',
    bottom: '10px',
    zIndex: -1,
    background: 'linear-gradient(to right, transparent, rgba(2, 2, 2, 0.6))',
  };

  const inputInputStyle: React.CSSProperties = {
    maxWidth: '100%',
    width: '650PX',
    height: '60px',
    padding: '0 67px',
    fontSize: '20px',
    background: 'none',
    border: 'none',
    color: 'white',
    position: 'relative',
    transition: `all 0.5s ${easeElastic}`,
    outline: 'none',
    borderRadius: inputRadius,
    zIndex: 2,
  };

  const inputInputPlaceholderStyle: React.CSSProperties = {
    color: '#d6d0d6',
  };

  const iconStyle: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    position: 'absolute',
    left: '14px',
    top: '8px',
    bottom: '8px',
    width: '42px',
    fontSize: '24px',
    color: iconColor,
    zIndex: 3,
    pointerEvents: 'none',
    // Corrected initial opacity for both icons - let's control visibility on icons themselves
  };

  const iconSvgStyle: React.CSSProperties = {
    gridArea: '1 / 1',
    transition: 'opacity 0.5s linear, transform 0.2s ease',
    overflow: 'visible',
  };

  const iconSvgLoadingGStyle: React.CSSProperties = {
    transformOrigin: 'center',
    animation: 'spinner 1s linear infinite', // Keyframes for spinner animation need to be defined separately if really needed inline.
  };
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

  const resultStyle: React.CSSProperties = {
    position: 'absolute',
    left: '11px',
    right: '11px',
    top: '100%',
    borderRadius: `0 0 ${inputRadius} ${inputRadius}`,
    transition: 'all 0.4s cubic-bezier(0.5, 0, 0, 1)',
    transitionDelay: '0.2s',
    background: 'black',
    backgroundClip: 'padding-box',
    border: 'solid 2px transparent',
    borderTop: '0',
    height: '0px', // Initially 0, height will be adjusted in state or focus logic
    pointerEvents: 'none',
  };

  const resultBeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    margin: '0 -2px -2px -2px',
    borderRadius: 'inherit',
    background: 'linear-gradient(105deg, #53285c, rgba(40, 40, 40, 0.2) 5%), linear-gradient(260deg, #a38aec, rgba(40, 40, 40, 0.2) 5%)',
    transition: 'opacity 0.4s linear',
    transitionDelay: '0.2s',
    opacity: 0,
  };

  const resultHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: '16px',
  };

  const resultHeaderBeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '2px',
    background: 'linear-gradient(to right, #361f3b 0%, #1d1721 10%, #1a1722 88%, #504474 100%)',
    transition: 'all 0.2s ease',
    width: '0%',
    transitionDelay: '1.1s', // Applied in state or focus logic
  };

  const resultHeaderAfterStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    right: '-59px',
    bottom: '69px',
    boxShadow: `0 0 40px 30px ${glowRColor}`,
    backgroundColor: glowRColor,
    width: '20%',
    height: '25%',
    filter: 'blur(40px)',
    borderRadius: '50%',
    transition: 'all 0.5s linear',
    transitionDelay: '0.3s', // Applied in state or focus logic
    opacity: 0, // Opacity will be updated in state or focus logic
  };

  const resultHeaderDivStyle: React.CSSProperties = {
    borderRadius: '6px',
    border: '0',
    color: '#5e5669',
    backgroundColor: 'transparent',
    fontSize: '13px',
    animation: 'slideUp 0.4s ease forwards', // Keyframes for slideUp animation need to be defined separately or removed.
    opacity: 0, // Opacity and animation for slideDown applied in state or focus logic
  };

  const resultHeaderLabelStyle: React.CSSProperties = {
    padding: '10px 10px 15px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
  };

  const resultHeaderLabelBeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-15px',
    height: '10px',
    width: '100%',
    margin: 'auto',
    borderRadius: '7px 7px 0 0',
    background: '#37333d',
    transition: `transform 0.3s ${easeElastic}, background 0.3s linear`,
  };

  const resultHeaderLabelAfterStyle: React.CSSProperties = {
    content: 'attr(data-label)', // Not directly inlineable, needs data-label prop handling
    position: 'absolute',
    margin: 'auto',
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0,
    color: 'white',
    filter: 'blur(6px)',
    transform: 'translateY(-80%)',
    transition: 'all 0.4s ease',
  };

  const resultHeaderLabelSpanStyle: React.CSSProperties = {
    display: 'block',
    transition: 'all 0.4s ease',
  };

  const resultContentHeaderStyle: React.CSSProperties = {
    display: 'flex',
    textAlign: 'center',
    color: 'white',
    background: 'linear-gradient(to bottom, #16131a 0%, transparent)',
    padding: '12px 6px 7px 6px',
    fontSize: '12px',
    animation: 'slideUp 0.5s ease forwards', // Keyframes for slideUp animation need to be defined separately or removed.
    opacity: 0, // Opacity and animation for slideDown applied in state or focus logic
  };

  const resultContentHeaderDivStyle: React.CSSProperties = {
    width: '100%',
    fontWeight: '600',
    animation: 'slideUp 0.4s ease forwards', // Keyframes for slideUp animation need to be defined separately or removed.
  };

  const resultContentHeaderDivSpanStyle: React.CSSProperties = {
    paddingLeft: '5px',
  };

  const resultContentStyle: React.CSSProperties = {
    position: 'relative',
    opacity: 0,
    display: 'flex',
    flexDirection: 'column',
    animation: 'visibility 1.4s ease forwards', // Keyframes for visibility animation need to be defined separately or removed.
  };

  const resultContentLavaStyle: React.CSSProperties = {
    position: 'absolute',
    left: '8px',
    right: '8px',
    top: 0,
    height: resultItemH,
    borderRadius: '8px',
    backgroundColor: 'rgb(18, 16, 20)',
    transition: 'all 0.3s ease',
    transform: 'scaleY(0)',
    opacity: 0,
    pointerEvents: 'none',
  };

  const resultContentAStyle: React.CSSProperties = {
    fontSize: '13px',
    display: 'flex',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    padding: '4px 5px',
    margin: 0,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
    animation: 'slideUp 0.4s ease forwards', // Keyframes for slideUp animation need to be defined separately or removed.
    opacity: 0, // Opacity and animation for slideDown applied in state or focus logic
  };

  const resultContentADivLastChildStyle: React.CSSProperties = {
    color: 'rgb(255 255 124 / 60%)',
  };

  const resultContentADivStyle: React.CSSProperties = {
    padding: '3px 5px',
    width: '100%',
    filter: 'grayscale(1)',
  };

  const glowStyle: React.CSSProperties = {
    width: '20%',
    height: '25%',
    borderRadius: '50%',
    opacity: 0.7,
    filter: 'blur(40px)',
    position: 'absolute',
    margin: 'auto',
    zIndex: -1,
    animation: 'glow 2s cubic-bezier(0.6, 0, 0.6, 1) infinite', // Keyframes for glow animation need to be defined separately or removed.
  };

  const inputGlowStyle: React.CSSProperties = {
    width: '10%',
    height: '0px',
    filter: 'blur(10px)',
    opacity: 0.3,
    animation: 'none',
  };

  const glowLeftStyle: React.CSSProperties = {
    boxShadow: `0 0 40px 30px ${glowLColor}`,
    backgroundColor: glowLColor,
    left: 0,
    top: '25%',
    ...glowStyle,
  };

  const glowRightStyle: React.CSSProperties = {
    boxShadow: `0 0 40px 30px ${glowRColor}`,
    backgroundColor: glowRColor,
    right: 0,
    bottom: '25%',
    ...glowStyle,
  };

  const glowLayerBgStyle: React.CSSProperties = {
    zIndex: -1,
    inset: '-2px',
    background: 'rgb(27, 27, 27)',
    borderRadius: inputRadius,
    overflow: 'hidden',
    position: 'absolute',
  };

  const glowOutlineStyle: React.CSSProperties = {
    zIndex: 9,
    inset: '-1px',
    transition: 'all 0.3s linear',
    opacity: 0,
    borderRadius: inputRadius,
    overflow: 'hidden',
    position: 'absolute',
  };

  const glowOutlineBeforeStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    content: '""',
    width: '110px',
    height: '420px',
    margin: 'auto',
    background: 'linear-gradient(90deg, transparent, rgba(197, 134, 203, 0.5), transparent)',
    animation: 'spin 3s linear infinite paused', // Keyframes for spin animation need to be defined separately or removed.
  };

  const glowLayer1Style: React.CSSProperties = {
    inset: '-2px',
    filter: 'blur(10px)',
    position: 'absolute',
    borderRadius: `calc(${inputRadius} * 1.1)`,
    background: 'linear-gradient(152deg, rgb(226 0 255 / 20%), rgb(0 0 0 / 0%) 40%), linear-gradient(330deg, rgba(65, 66, 82, 0.9), rgb(0 0 0 / 0%) 40%), linear-gradient(40deg, rgba(180, 93, 184, 0.3), rgb(0 0 0 / 0%) 40%), linear-gradient(220deg, rgb(81 52 157 / 80%), rgb(0 0 0 / 0%) 40%)',
    position: 'absolute',
  };

  const glowLayer1BeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '30%',
    height: '75%',
    borderRadius: '20%',
    boxShadow: '0 0 50px currentColor',
    transition: 'all 0.5s cubic-bezier(0.6, 0, 0.6, 1)',
    left: 0,
    top: 0,
    background: 'linear-gradient(to right, #c44e93 40%, transparent 100%)',
  };

  const glowLayer1AfterStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '30%',
    height: '75%',
    borderRadius: '20%',
    boxShadow: '0 0 50px currentColor',
    transition: 'all 0.5s cubic-bezier(0.6, 0, 0.6, 1)',
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to left, #584ec4 40%, transparent 100%)',
  };

  const glowLayer2Style: React.CSSProperties = {
    inset: '-5px',
    position: 'absolute',
    filter: 'blur(3px)',
    zIndex: 2,
  };

  const glowLayer2BeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '20%',
    height: '70%',
    left: 0,
    top: 0,
    background: 'radial-gradient(at left top, #ff07b0, transparent 70%)',
    borderRadius: `calc(${inputRadius} * 1.2) 100% 0 20%`,
  };

  const glowLayer2AfterStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '20%',
    height: '70%',
    right: 0,
    bottom: 0,
    background: 'radial-gradient(at right bottom, #7b0ac7, transparent 70%)',
    borderRadius: `0 50% calc(${inputRadius} * 1.2) 100%`,
  };

  const glowLayer3Style: React.CSSProperties = {
    inset: '-3px',
    position: 'absolute',
    zIndex: 2,
  };

  const glowLayer3BeforeStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '70%',
    height: '80%',
    left: 0,
    top: 0,
    background: 'radial-gradient(at left top, white, transparent 70%)',
    filter: 'blur(1.5px)',
    borderRadius: `calc(${inputRadius} * 1.2) 100% 0 20%`,
  };

  const glowLayer3AfterStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    width: '70%',
    height: '100%',
    right: 0,
    bottom: 0,
    background: 'radial-gradient(at right bottom, white, transparent 70%)',
    filter: 'blur(1.5px)',
    borderRadius: `0 50% calc(${inputRadius} * 1.2) 100%`,
  };


  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isFilterHovered, setIsFilterHovered] = React.useState(false);
  const [isFilterFocused, setIsFilterFocused] = React.useState(false);
  const [isResultVisible, setIsResultVisible] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsResultVisible(e.target.value.length > 0); // Result visibility based on input length
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
    <div style={containerStyle} className="container">
      <div style={bgStyle} className="bg" >
        <div style={bgBeforeStyle} className="bg::before" />
      </div>
      <div style={inputWrapperStyle} className="input-wrapper" >
        <div style={{...inputStyle, ...(isInputFocused ? { focusWithin : {} } : {}) }} className="input">
          <div style={glowLeftStyle} className="glow left"></div>
          <div style={glowRightStyle} className="glow right"></div>

          <input
            type="text"
            name="text"
            placeholder="Ask anything..."
            style={{...inputInputStyle, ...(inputValue ? {width: '360px'} : {} )}}
            placeholderStyle={inputInputPlaceholderStyle}
            className="input input"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
          />

          <div style={{...reflectionStyle, ...(isInputFocused ? { focusWithin : {} } : {}) }} className="reflection">
            <div style={{...reflectionBeforeStyle, ...(isInputFocused ? { transform: 'translate(440px, 0) skew(40deg) scaleX(0.5)'} : {}) }} className="reflection:before"></div>
            <div style={reflectionAfterStyle} className="reflection::after"></div>
          </div>

          <div style={iconStyle} className="icon">
       

            <svg
              viewBox="0 0 490.4 490.4"
              version="1.1"
              width="14px"
              height="14px"
              fill={iconColor}
              xmlns="http://www.w3.org/2000/svg"
              style={{
                ...iconSvgStyle,
                opacity: (isInputFocused && inputValue) ? 0 : 1, // Hide magnifier on focus and input value, else show
                transform: (isInputFocused && inputValue) ? 'scale(1.2) translate(1.7px, 1.7px)' : 'scale(1) translate(none)', // Apply transform on focus and input
                transitionDelay: (isInputFocused && inputValue) ? '0.3s' : undefined, // Apply delay only when hiding magnifier
              }}
              className="magnifier"
            >
              <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796  s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z   M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"
              ></path>
            </svg>

            <svg
              viewBox="0 0 490.4 490.4"
              version="1.1"
              width="14px"
              height="14px"
              fill={iconColor}
              xmlns="http://www.w3.org/2000/svg"
              style={iconSvgStyle}
              className="magnifier"
            >
              <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796  s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z   M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"
              ></path>
            </svg>
          </div>

          <button
            style={{...filterStyle, ...(isFilterHovered ? { filter: 'brightness(1.3)'} : {} )}}
            className="filter"
            onMouseEnter={handleFilterHover}
            onMouseLeave={handleFilterMouseLeave}
            onFocus={handleFilterFocus}
            onBlur={handleFilterBlur}
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

          <div style={{...resultStyle, ...(isResultVisible ? { height: '193px', pointerEvents: 'all'} : {})}} className="result">
            <div style={{...resultBeforeStyle, ...(isResultVisible ? { opacity: 1} : {})}} className="result::before"></div>
            <header style={resultHeaderStyle} className="result-header">
              <div style={{...resultHeaderDivStyle, '--i': 1 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-header div">
                <input type="radio" id="all" name="tab" defaultChecked className="result [type='radio']" />
                <label htmlFor="all" data-label="All" style={resultHeaderLabelStyle} className="result-header label">
                  <div style={resultHeaderLabelBeforeStyle} className="result-header label::before"></div>
                  <div style={resultHeaderLabelAfterStyle} className="result-header label::after"></div>
                  <span style={resultHeaderLabelSpanStyle} className="result-header label span">All</span>
                </label>
              </div>
              <div style={{...resultHeaderDivStyle, '--i': 2 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-header div">
                <input type="radio" id="buttons" name="tab" className="result [type='radio']" />
                <label htmlFor="buttons" data-label="Buttons" style={resultHeaderLabelStyle} className="result-header label">
                <div style={resultHeaderLabelBeforeStyle} className="result-header label::before"></div>
                  <div style={resultHeaderLabelAfterStyle} className="result-header label::after"></div>
                  <span style={resultHeaderLabelSpanStyle} className="result-header label span">Buttons</span>
                </label>
              </div>
              <div style={{...resultHeaderDivStyle, '--i': 3 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-header div">
                <input type="radio" id="cards" name="tab" className="result [type='radio']" />
                <label htmlFor="cards" data-label="Cards" style={resultHeaderLabelStyle} className="result-header label">
                <div style={resultHeaderLabelBeforeStyle} className="result-header label::before"></div>
                  <div style={resultHeaderLabelAfterStyle} className="result-header label::after"></div>
                  <span style={resultHeaderLabelSpanStyle} className="result-header label span">Cards</span>
                </label>
              </div>
              <div style={{...resultHeaderDivStyle, '--i': 4 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-header div">
                <input type="radio" id="inputs" name="tab" className="result [type='radio']" />
                <label htmlFor="inputs" data-label="Inputs" style={resultHeaderLabelStyle} className="result-header label">
                <div style={resultHeaderLabelBeforeStyle} className="result-header label::before"></div>
                  <div style={resultHeaderLabelAfterStyle} className="result-header label::after"></div>
                  <span style={resultHeaderLabelSpanStyle} className="result-header label span">Inputs</span>
                </label>
              </div>
              <div style={{...resultHeaderBeforeStyle, ...(isResultVisible ? { width: '100%'} : {})}} className="result-header::before"></div>
              <div style={{...resultHeaderAfterStyle, ...(isResultVisible ? { opacity: 0.7} : {})}} className="result-header::after"></div>
            </header>

            <div style={{...resultContentHeaderStyle, ...(isResultVisible ? { opacity: 1, animation: 'fadeIn 1.4s ease forwards'} : {})}} className="result-content-header">
              <div style={{...resultContentHeaderDivStyle, '--i': 1, ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content-header div">Name <span style={resultContentHeaderDivSpanStyle} className="result-content-header div span">↓</span></div>
              <div style={{...resultContentHeaderDivStyle, '--i': 2, ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content-header div">Date</div>
              <div style={{...resultContentHeaderDivStyle, '--i': 3, ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content-header div">Rating</div>
            </div>

            <div style={{...resultContentStyle, ...(isResultVisible ? { opacity: 1} : {})}} className="result-content">
              <a style={{...resultContentAStyle, '--i': 1 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content a">
                <div style={resultContentADivStyle} className="result-content a div">Item I</div>
                <div style={resultContentADivStyle} className="result-content a div">11th July</div>
                <div style={{...resultContentADivLastChildStyle, ...resultContentADivStyle}} className="result-content a div:last-child">★★★★★</div>
              </a>
              <a style={{...resultContentAStyle, '--i': 2 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content a">
                <div style={resultContentADivStyle} className="result-content a div">Item II</div>
                <div style={resultContentADivStyle} className="result-content a div">09th June</div>
                <div style={resultContentADivStyle} className="result-content a div">★★★★</div>
              </a>
              <a style={{...resultContentAStyle, '--i': 3 , ...(isResultVisible ? { animation: 'slideDown 1.4s ease forwards'} : {}) }} className="result-content a">
                <div style={resultContentADivStyle} className="result-content a div">Item III</div>
                <div style={resultContentADivStyle} className="result-content a div">07th May</div>
                <div style={resultContentADivStyle} className="result-content a div">★★★</div>
              </a>
              <div style={resultContentLavaStyle} className="result-content lava"></div>
            </div>
          </div>
        </div>
        <div style={{...glowOutlineStyle, ...(isInputFocused ? { transitionDuration: '0.2s', opacity: 0} : {})}} className="glow-outline">
          <div style={{...glowOutlineBeforeStyle, ...(isInputFocused ? { animationPlayState: 'paused'} : {animationPlayState: 'running'} )}} className="glow-outline::before"></div>
        </div>
        <div style={glowLayerBgStyle} className="glow-layer-bg"></div>
        <div style={glowLayer1Style} className="glow-layer-1">
          <div style={{...glowLayer1BeforeStyle, ...(isInputFocused ? { width: '70%', height: '95%'} : {})}} className="glow-layer-1::before"></div>
          <div style={{...glowLayer1AfterStyle, ...(isInputFocused ? { width: '70%', height: '95%'} : {})}} className="glow-layer-1::after"></div>
        </div>
        <div style={glowLayer2Style} className="glow-layer-2">
          <div style={glowLayer2BeforeStyle} className="glow-layer-2::before"></div>
          <div style={glowLayer2AfterStyle} className="glow-layer-2::after"></div>
        </div>
        <div style={glowLayer3Style} className="glow-layer-3">
          <div style={glowLayer3BeforeStyle} className="glow-layer-3::before"></div>
          <div style={glowLayer3AfterStyle} className="glow-layer-3::after"></div>
        </div>
        <div style={glowLeftStyle} className="glow left"></div>
        <div style={glowRightStyle} className="glow right"></div>
      </div>
    </div>
  );
};

export default UiverseSearchComponent;