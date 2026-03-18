import React from 'react';

interface RequiredIndicatorProps {
  isRequired: boolean;
}

const RequiredIndicator: React.FC<RequiredIndicatorProps> = ({ isRequired }) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <div className={`w-3 h-3 rounded-full ${isRequired ? 'bg-red-500' : 'bg-blue-400'}`}></div>
      <span className="text-sm text-gray-600">
        {isRequired ? 'Required Field' : 'Optional Field'}
      </span>
    </div>
  );
};

export default RequiredIndicator;