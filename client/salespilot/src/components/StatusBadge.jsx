import React from 'react';
import { cn } from '../lib/utils'; 

const StatusBadge = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'New':
        return 'bg-status-new bg-opacity-20 text-status-new border border-status-new';
      case 'Contacted':
        return 'bg-status-contacted bg-opacity-20 text-status-contacted border border-status-contacted';
      case 'Interested':
        return 'bg-status-interested bg-opacity-20 text-status-interested border border-status-interested';
      case 'Converted':
        return 'bg-status-converted bg-opacity-20 text-status-converted border border-status-converted';
      case 'Lost':
        return 'bg-status-lost bg-opacity-20 text-status-lost border border-status-lost';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <span className={cn(
      'status-badge',
      getStatusColor(),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
