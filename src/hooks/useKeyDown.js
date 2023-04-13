import { useEffect } from 'react';

export default function useKeyDown (key, callback) {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === key) {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
