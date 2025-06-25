import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const UserAvatar = ({ 
  name, 
  email, 
  imageUrl, 
  size = 'md' 
}) => {
  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || email || 'User'} />}
      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
