import React from 'react';

export const ModernCard = ({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) => {
  return (
    <div 
      className={`modern-card ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const StatusCard = ({ type = 'info', title, message, icon, action }) => {
  const typeClasses = {
    success: 'status-success',
    error: 'status-error', 
    warning: 'status-warning',
    info: 'status-info'
  };

  return (
    <div className={`${typeClasses[type]} animate-fade-in`}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        {icon && <span className="text-lg sm:text-xl">{icon}</span>}
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1 text-sm sm:text-base">{title}</h4>}
          <p className="text-xs sm:text-sm">{message}</p>
          {action && <div className="mt-2 sm:mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <ModernCard hover className="padding-mobile text-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
    </ModernCard>
  );
};