'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
}

type DraggingHandle = 'min' | 'max' | null;

export default function PriceRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  label = 'Price Range',
}: PriceRangeSliderProps) {
  const [draggingHandle, setDraggingHandle] = useState<DraggingHandle>(null);
  const [tempValue, setTempValue] = useState<[number, number]>(value);
  const [showTooltip, setShowTooltip] = useState<DraggingHandle>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync tempValue with value prop when not dragging
  useEffect(() => {
    if (!draggingHandle) {
      setTempValue(value);
    }
  }, [value, draggingHandle]);

  // Helper: Calculate value from position
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);

      // Snap to step with magnetic behavior
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step]
  );

  // Helper: Calculate percentage for visual positioning
  const getPercentage = useCallback(
    (val: number): number => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  // Handle drag start (mouse)
  const handleMouseDown = useCallback(
    (handle: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      setDraggingHandle(handle);
      setShowTooltip(handle);
    },
    []
  );

  // Handle drag start (touch)
  const handleTouchStart = useCallback(
    (handle: 'min' | 'max') => (e: React.TouchEvent) => {
      e.preventDefault();
      setDraggingHandle(handle);
      setShowTooltip(handle);
    },
    []
  );

  // Handle drag move (mouse)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingHandle) return;

      const newValue = getValueFromPosition(e.clientX);

      if (draggingHandle === 'min') {
        // Ensure min doesn't exceed max
        setTempValue([Math.min(newValue, tempValue[1] - step), tempValue[1]]);
      } else {
        // Ensure max doesn't go below min
        setTempValue([tempValue[0], Math.max(newValue, tempValue[0] + step)]);
      }
    },
    [draggingHandle, getValueFromPosition, tempValue, step]
  );

  // Handle drag move (touch)
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!draggingHandle) return;

      const touch = e.touches[0];
      if (!touch) return;

      const newValue = getValueFromPosition(touch.clientX);

      if (draggingHandle === 'min') {
        setTempValue([Math.min(newValue, tempValue[1] - step), tempValue[1]]);
      } else {
        setTempValue([tempValue[0], Math.max(newValue, tempValue[0] + step)]);
      }
    },
    [draggingHandle, getValueFromPosition, tempValue, step]
  );

  // Handle drag end (mouse & touch)
  const handleDragEnd = useCallback(() => {
    if (!draggingHandle) return;

    onChange(tempValue);
    setDraggingHandle(null);

    // Keep tooltip visible for a moment after release
    setTimeout(() => {
      setShowTooltip(null);
    }, 300);
  }, [draggingHandle, tempValue, onChange]);

  // Attach global event listeners for dragging
  useEffect(() => {
    if (!draggingHandle) return;

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [draggingHandle, handleMouseMove, handleTouchMove, handleDragEnd]);

  const minPercentage = getPercentage(tempValue[0]);
  const maxPercentage = getPercentage(tempValue[1]);

  return (
    <div className="space-y-4">
      <label className="text-xs font-sans text-text-secondary block">
        {label}
      </label>

      {/* Slider Track Container */}
      <div className="relative pt-8 pb-2">
        {/* Track Background */}
        <div
          ref={trackRef}
          className="relative h-2 bg-border rounded-full cursor-pointer"
          onClick={(e) => {
            // Quick jump to value on track click
            const newValue = getValueFromPosition(e.clientX);
            // Determine which handle is closer
            const distToMin = Math.abs(newValue - tempValue[0]);
            const distToMax = Math.abs(newValue - tempValue[1]);

            if (distToMin < distToMax) {
              onChange([Math.min(newValue, tempValue[1] - step), tempValue[1]]);
            } else {
              onChange([tempValue[0], Math.max(newValue, tempValue[0] + step)]);
            }
          }}
        >
          {/* Active Range Highlight */}
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-100"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>

        {/* Min Handle - Left Edge */}
        <div
          className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${minPercentage}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
        >
          {/* Visual Hit Area (invisible, larger for accessibility) */}
          <div className="absolute inset-0 w-11 h-11 -m-[14px]" aria-hidden="true" />

          {/* Visible Handle */}
          <div
            className={`w-3 h-3 bg-white border-[1.5px] border-primary rounded-full shadow-sm transition-all duration-200 ease-out ${
              draggingHandle === 'min' ? 'scale-125 ring-[3px] ring-primary/20' : 'hover:scale-110'
            }`}
            style={{ touchAction: 'none' }}
          />

          {/* Tooltip */}
          {showTooltip === 'min' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 bg-text-primary text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-fade-in">
              ₦{tempValue[0].toLocaleString()}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                <div className="border-4 border-transparent border-t-text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Max Handle - Right Edge */}
        <div
          className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${maxPercentage}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
        >
          {/* Visual Hit Area (invisible, larger for accessibility) */}
          <div className="absolute inset-0 w-11 h-11 -m-[14px]" aria-hidden="true" />

          {/* Visible Handle */}
          <div
            className={`w-3 h-3 bg-white border-[1.5px] border-primary rounded-full shadow-sm transition-all duration-200 ease-out ${
              draggingHandle === 'max' ? 'scale-125 ring-[3px] ring-primary/20' : 'hover:scale-110'
            }`}
            style={{ touchAction: 'none' }}
          />

          {/* Tooltip */}
          {showTooltip === 'max' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 bg-text-primary text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-fade-in">
              ₦{tempValue[1].toLocaleString()}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                <div className="border-4 border-transparent border-t-text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Labels (Always Visible) */}
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary font-sans">Min:</span>
          <span className="font-mono font-semibold text-primary">
            ₦{tempValue[0].toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-secondary font-sans">Max:</span>
          <span className="font-mono font-semibold text-primary">
            ₦{tempValue[1].toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
