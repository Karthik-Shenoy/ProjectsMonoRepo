import React from 'react';
import clsx from 'clsx';

interface TypographyProps {
  variant?: 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'default';
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'default',
  align = 'left',
  className = '',
  children,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'title':
        return 'text-3xl font-bold';
      case 'heading':
        return 'text-2xl font-semibold';
      case 'subheading':
        return 'text-xl font-medium';
      case 'body':
        return 'text-base';
      case 'caption':
        return 'text-sm';
      case 'label':
        return 'text-sm font-medium';
      default:
        return 'text-base';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-blue-600 dark:text-blue-400';
      case 'secondary':
        return 'text-gray-600 dark:text-gray-300';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'default':
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getAlignClasses = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'left':
      default:
        return 'text-left';
    }
  };

  return (
    <div
      className={clsx(
        getVariantClasses(),
        getColorClasses(),
        getAlignClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};
