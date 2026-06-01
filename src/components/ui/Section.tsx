import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = '', fullWidth = false }) => {
  return (
    <section
      id={id}
      className={`relative ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} ${className}`}
    >
      {children}
    </section>
  );
};
