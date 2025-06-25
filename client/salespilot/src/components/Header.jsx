import React from 'react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { UserPlus, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from './ui/use-toast';

const Header = ({
  activeTab,
  onTabChange,
  onAddLeadClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6 pb-4 md:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SalesPilot</h1>
          <p className="text-muted-foreground">
            Manage your sales pipeline and track leads efficiently
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onAddLeadClick} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Lead
          </Button>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <UserAvatar name={user.name} email={user.email} />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="dashboard" className="flex-1 sm:flex-initial">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex-1 sm:flex-initial">
            Leads
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Header;
