import React, { useState, useRef } from 'react';
import './ColorPicker.css';

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
        default: h = 0;
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
    
    const newSaturation = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    const newLightness = Math.max(0, Math.min(100, Math.round(100 - (y / rect.height) * 100)));
    
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
    const newHue = Math.max(0, Math.min(360, Math.round((y / rect.height) * 360)));
    
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
    <div className="journal-color-picker-panel-m">
      <div className="journal-color-picker-header-m">
        <span className="journal-color-picker-title-m">Select Color</span>
        <button onClick={onClose} className="journal-color-picker-close-btn-m" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="journal-color-picker-main-m">
        <div 
          ref={gradientRef}
          className="journal-color-gradient-m" 
          onMouseDown={handleGradientClick}
          style={{
            background: `
              linear-gradient(to bottom, 
                hsl(${hue}, 100%, 100%) 0%, 
                hsl(${hue}, 100%, 50%) 50%, 
                hsl(${hue}, 100%, 0%) 100%
              ),
              linear-gradient(to right, 
                hsl(${hue}, 0%, 50%) 0%, 
                hsl(${hue}, 100%, 50%) 100%
              )`
          }}
        >
          <div 
            className="journal-color-picker-cursor-m"
            style={{
              left: `${saturation}%`,
              top: `${100 - lightness}%`
            }}
          />
        </div>
        
        <div 
          ref={hueRef}
          className="journal-hue-slider-m" 
          onMouseDown={handleHueClick}
        >
          <div 
            className="journal-hue-cursor-m"
            style={{ top: `${(hue / 360) * 100}%` }}
          />
        </div>
      </div>

      <div className="journal-color-current-preview-m">
        <div 
          className="journal-color-preview-swatch-m"
          style={{ backgroundColor: hslToHex(hue, saturation, lightness) }}
        ></div>
        <input 
          type="text" 
          value={hexInput}
          onChange={handleHexChange}
          className="journal-hex-input-m"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      <div className="journal-preset-colors-m">
        <div className="journal-preset-colors-label-m">Preset Colors</div>
        <div className="journal-preset-colors-grid-m">
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
              className={`journal-preset-color-swatch-m ${color.toUpperCase() === presetColor.toUpperCase() ? 'active' : ''}`}
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;