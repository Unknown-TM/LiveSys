import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    function handleKeyPress(event) {
      // Check if user is typing in an input
      if (event.target.tagName === 'INPUT') return;

      const shortcut = shortcuts.find(s => 
        s.key === event.key && 
        s.ctrl === event.ctrlKey &&
        s.shift === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    }

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
} 