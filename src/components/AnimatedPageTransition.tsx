
import React from 'react';

interface AnimatedPageTransitionProps {
  children: React.ReactNode;
}

const AnimatedPageTransition: React.FC<AnimatedPageTransitionProps> = ({ children }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default AnimatedPageTransition;
