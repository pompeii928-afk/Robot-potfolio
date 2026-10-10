import React, { useEffect, useState, useRef } from 'react';

type CursorVariant = 'default' | 'hover' | 'view' | 'play' | 'external' | 'text' | 'hidden';

export const CustomCursor: React.FC = () => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position references for smooth interpolation (Lerp)
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const circlePos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touchscreen / non-pointer devices
    if (typeof window !== 'undefined') {
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
      if (isTouch) return;

      document.body.classList.add('has-custom-cursor');
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      setVariant('default');
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global event listener to detect hovered element types and attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Explicit data-cursor attribute
      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor') as CursorVariant;
        const customLabel = cursorTarget.getAttribute('data-cursor-label');
        if (customType) {
          setVariant(customType);
          setLabel(customLabel || (customType === 'view' ? 'VIEW ↗' : customType === 'play' ? 'PLAY ▶' : customType === 'external' ? 'VISIT ↗' : ''));
          return;
        }
      }

      // 2. Project Card or Media Card detection
      const projectCard = target.closest<HTMLElement>('#experience .group, [data-project-card]');
      if (projectCard) {
        setVariant('view');
        setLabel('VIEW ↗');
        return;
      }

      // 3. YouTube Video Card
      const youtubeCard = target.closest<HTMLElement>('#youtube-section .group');
      if (youtubeCard) {
        setVariant('play');
        setLabel('PLAY ▶');
        return;
      }

      // 4. External site iframe / card
      const externalCard = target.closest<HTMLElement>('#external-site .group, a[target="_blank"]');
      if (externalCard) {
        setVariant('external');
        setLabel('VISIT ↗');
        return;
      }

      // 5. Input or Textarea
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setVariant('text');
        setLabel('');
        return;
      }

      // 6. Generic Interactive Controls (Buttons, links, tabs, select, checkboxes)
      const interactive = target.closest<HTMLElement>(
        'button, a, [role="button"], select, label, [data-interactive="true"], summary'
      );
      if (interactive) {
        setVariant('hover');
        setLabel('');
        return;
      }

      // Default state
      setVariant('default');
      setLabel('');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Animation Loop: High-performance Lerp
    const render = () => {
      // Dot follows closely (factor 0.35)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.35;

      // Outer follower follows with elegant inertia (factor 0.16)
      circlePos.current.x += (mousePos.current.x - circlePos.current.x) * 0.16;
      circlePos.current.y += (mousePos.current.y - circlePos.current.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${circlePos.current.x}px, ${circlePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  // Compute outer circle styles based on variant
  const isEnlarged = variant === 'view' || variant === 'play' || variant === 'external';
  const isHover = variant === 'hover';
  const isText = variant === 'text';

  // Size calculation
  const circleSize = isEnlarged ? 76 : isHover ? 44 : isText ? 4 : 28;
  const dotSize = isEnlarged ? 0 : isHover ? 0 : isText ? 0 : 6;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Trailing Outer Ring / Backdrop Disc */}
      <div
        ref={circleRef}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          marginLeft: `-${circleSize / 2}px`,
          marginTop: `-${circleSize / 2}px`,
        }}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-[width,height,margin,background-color,border-color,transform] duration-200 ease-out select-none will-change-transform ${
          isClicking ? 'scale-90' : 'scale-100'
        } ${
          isEnlarged
            ? variant === 'play'
              ? 'bg-[#ff4d1d] text-white shadow-xl border border-white/20'
              : 'bg-[#0a0a0a] text-white dark:bg-[#f4f2ee] dark:text-[#0a0a0a] shadow-xl border border-white/10 dark:border-black/10'
            : isHover
            ? 'bg-[#ff4d1d]/15 border border-[#ff4d1d]/60 backdrop-blur-[2px]'
            : isText
            ? 'bg-transparent'
            : 'border border-[#0a0a0a]/30 dark:border-white/30 bg-transparent'
        }`}
      >
        {isEnlarged && label && (
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase whitespace-nowrap animate-in fade-in duration-150">
            {label}
          </span>
        )}
      </div>

      {/* Central Precision Dot */}
      {dotSize > 0 && (
        <div
          ref={dotRef}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            marginLeft: `-${dotSize / 2}px`,
            marginTop: `-${dotSize / 2}px`,
          }}
          className="fixed top-0 left-0 rounded-full bg-[#ff4d1d] shadow-xs will-change-transform"
        />
      )}
    </div>
  );
};
