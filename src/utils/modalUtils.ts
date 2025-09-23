// Utility functions for managing modal accessibility and focus

export const disableBodyScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

export const enableBodyScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

export const showInert = (element: HTMLElement) => {
  element.removeAttribute('inert');
};

export const hideInert = (element: HTMLElement) => {
  element.setAttribute('inert', '');
};