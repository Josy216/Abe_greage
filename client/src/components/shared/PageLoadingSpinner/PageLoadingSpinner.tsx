import { ScaleLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PageLoadingSpinner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Set loading to true when route changes
    handleStart();
    
    // Simulate loading time (you can adjust this)
    const timer = setTimeout(() => {
      handleComplete();
    }, 300);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [location]);

  if (!isLoading) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <ScaleLoader color="#ff4d30" />
    </div>
  );
};

export default PageLoadingSpinner;
