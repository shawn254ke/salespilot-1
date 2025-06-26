import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import StatusBadge from './StatusBadge';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog';
import { MoreVertical, Trash2, Edit, Phone, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDelete = () => {
    setConfirmOpen(false);
    onDelete(lead);
  };
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{lead.name}</h3>
            <p className="text-sm text-muted-foreground">{lead.company}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            Source: {lead.source}
          </p>
          <p className="text-xs text-muted-foreground">
            Created: {lead.createdOn ? (typeof lead.createdOn === 'string' ? new Date(lead.createdOn).toLocaleDateString() : lead.createdOn.toLocaleDateString()) : '-'}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead & Contact?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this contact and all associated lead status. Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(lead)}>Edit Lead</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-destructive">Delete Lead</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
