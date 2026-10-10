import React, { useEffect, useState, useRef } from 'react';

type CursorVariant = 'default' | 'hover' | 'view' | 'play' | 'external' | 'text' | 'hidden';

export const CustomCursor: React.FC = () => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Position references for 60/120fps smooth interpolation (Lerp)
  const mousePos = useRef({ x: -100, y: -100 });
  const circlePos = useRef({ x: -100, y: -100 });
  const isFirstMove = useRef(true);

  const circleRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isFirstMove.current) {
        circlePos.current = { x: e.clientX, y: e.clientY };
        isFirstMove.current = false;
      }

      setIsVisible(true);
      document.body.classList.add('has-custom-cursor');
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      setIsVisible(false);
      setVariant('default');
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onTouchStart = () => {
      setIsVisible(false);
      document.body.classList.remove('has-custom-cursor');
    };

    // Global element hover inspector
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Explicit data-cursor attribute
      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor') as CursorVariant;
        const customLabel = cursorTarget.getAttribute('data-cursor-label');
        if (customType) {
          setVariant(customType);
          setLabel(
            customLabel ||
              (customType === 'view'
                ? 'VIEW ↗'
                : customType === 'play'
                ? 'PLAY ▶'
                : customType === 'external'
                ? 'VISIT ↗'
                : '')
          );
          return;
        }
      }

      // 2. Project Card or Media Card
      const projectCard = target.closest<HTMLElement>(
        '#experience .group, [data-project-card], .project-card'
      );
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

      // 4. External site links
      const externalLink = target.closest<HTMLElement>('#external-site .group, a[target="_blank"]');
      if (externalLink) {
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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // Smooth Lerp Animation Loop
    const render = () => {
      // White follower disc follows with elegant smooth inertia
      circlePos.current.x += (mousePos.current.x - circlePos.current.x) * 0.22;
      circlePos.current.y += (mousePos.current.y - circlePos.current.y) * 0.22;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${circlePos.current.x}px, ${circlePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('touchstart', onTouchStart);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // Size calculation: Solid white fill, zero center dot, tight border
  const isEnlarged = variant === 'view' || variant === 'play' || variant === 'external';
  const isHover = variant === 'hover';
  const isText = variant === 'text';

  // Tight default disc: 11px pure solid white. Interactive hover: 34px smooth expansion. Card hover: 74px disc with black text.
  const circleSize = isEnlarged ? 74 : isHover ? 34 : isText ? 0 : 11;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999999] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Pure Solid White Cursor Disc (No center dot, zero dot, filled white interior, thin crisp edge) */}
      <div
        ref={circleRef}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          marginLeft: `-${circleSize / 2}px`,
          marginTop: `-${circleSize / 2}px`,
        }}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-[width,height,margin,background-color,border-color,transform] duration-200 ease-out select-none will-change-transform ${
          isClicking ? 'scale-85' : 'scale-100'
        } ${
          isEnlarged
            ? 'bg-black text-white font-mono font-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-black'
            : isHover
            ? 'bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-black/30'
            : isText
            ? 'bg-transparent border-transparent'
            : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.22)] border border-black/30'
        }`}
      >
        {isEnlarged && label && (
          <span className="font-mono text-[10px] font-black tracking-widest uppercase whitespace-nowrap text-white select-none pointer-events-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
