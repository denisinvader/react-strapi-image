import { ReactNode, useEffect, useState } from 'react';
import { css } from '@emotion/css';

export interface WindowSizeIndicatorProps {
  children: ReactNode;
}

const valueClassName = css({
  position: 'fixed',
  insetBlockStart: 0,
  insetInlineStart: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  color: '#111',
  fontSize: '1rem',
  fontFamily: 'monospace',
  padding: '0.125em 0.25em',
  zIndex: 100,
});

export const WindowSizeIndicator = function WindowSizeIndicator({
  children,
}: WindowSizeIndicatorProps) {
  const [value, setValue] = useState(`${Math.round(window.innerWidth)} ✕ ${Math.round(window.innerHeight)}`);
  useEffect(() => {
    const updateDocumentSize = () => {
      const { width, height } = document.documentElement.getBoundingClientRect();
      setValue(`${Math.round(width)} ✕ ${Math.round(height)}`);
    };
    const resizeObserver = new ResizeObserver(updateDocumentSize);
    resizeObserver.observe(document.documentElement);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <span className={valueClassName}>{value}</span>
      {children}
    </>
  );
};
