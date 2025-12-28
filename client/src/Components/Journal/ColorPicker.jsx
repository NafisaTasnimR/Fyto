import React, { useState, useRef } from 'react';

const ColorPicker = ({ color, onChange, onClose }) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState(color);

  const gradientRef = useRef(null);
  const hueRef = useRef(null);

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 100, l: 50 };
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  React.useEffect(() => {
    const hsl = hexToHsl(color);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setHexInput(color);
  }, [color]);

  const handleGradientClick = (e) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSaturation = Math.round((x / rect.width) * 100);
    const newLightness = Math.round(100 - (y / rect.height) * 100);
    
    setSaturation(newSaturation);
    setLightness(newLightness);
    
    const newColor = hslToHex(hue, newSaturation, newLightness);
    setHexInput(newColor);
    onChange(newColor);
  };

  const handleHueClick = (e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newHue = Math.round((y / rect.height) * 360);
    
    setHue(newHue);
    const newColor = hslToHex(newHue, saturation, lightness);
    setHexInput(newColor);
    onChange(newColor);
  };

  const handleHexChange = (e) => {
    const value = e.target.value;
    setHexInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const hsl = hexToHsl(value);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      onChange(value);
    }
  };

  const presetColors = [
    '#000000', '#FFFFFF', '#E7E9EB', '#44546A', '#4472C4', '#ED7D31',
    '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47', '#264478', '#9E480E',
    '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050',
    '#00B0F0', '#0070C0', '#002060', '#7030A0'
  ];

  return (
    <div className="color-picker-panel">
      <div className="color-picker-header">
        <span>Select Color</span>
        <button onClick={onClose} className="close-picker-btn">×</button>
      </div>
      
      <div className="color-picker-main">
        <div 
          ref={gradientRef}
          className="color-gradient" 
          onClick={handleGradientClick}
          style={{
            background: `linear-gradient(to bottom, 
              hsl(${hue}, 100%, 100%) 0%, 
              hsl(${hue}, 100%, 50%) 50%, 
              hsl(${hue}, 100%, 0%) 100%),
              linear-gradient(to right, 
              hsl(${hue}, 0%, 50%) 0%, 
              hsl(${hue}, 100%, 50%) 100%)`
          }}
        >
          <div 
            className="color-picker-cursor"
            style={{
              left: `${saturation}%`,
              top: `${100 - lightness}%`
            }}
          />
        </div>
        
        <div 
          ref={hueRef}
          className="hue-slider" 
          onClick={handleHueClick}
        >
          <div 
            className="hue-cursor"
            style={{ top: `${(hue / 360) * 100}%` }}
          />
        </div>
        
        <div className="brightness-slider">
          <div className="brightness-gradient" style={{ background: `linear-gradient(to bottom, #000 0%, transparent 100%)` }} />
        </div>
      </div>

      <div className="hex-input-container">
        <input 
          type="text" 
          value={hexInput}
          onChange={handleHexChange}
          className="hex-input"
          placeholder="#000000"
        />
      </div>

      <div className="preset-colors">
        {presetColors.map(presetColor => (
          <button
            key={presetColor}
            onClick={() => {
              const hsl = hexToHsl(presetColor);
              setHue(hsl.h);
              setSaturation(hsl.s);
              setLightness(hsl.l);
              setHexInput(presetColor);
              onChange(presetColor);
            }}
            className={`preset-color-swatch ${color === presetColor ? 'active' : ''}`}
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;