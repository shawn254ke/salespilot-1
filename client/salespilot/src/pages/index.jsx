import React, { useState, useEffect } from 'react';
// Removed: import { Lead } from '../types/lead';

import Header from '../components/Header';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import Dashboard from '../components/Dashboard';
import { toast } from '../components/ui/use-toast';

const Index = () => {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch('http://localhost:5555/contacts/', {
      headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contacts');
        return res.json();
      })
      .then((data) => setLeads(data.map(lead => ({
        ...lead,
        status: lead.status || lead.lead_status,
        createdOn: lead.createdOn || (lead.created_at ? new Date(lead.created_at) : undefined)
      }))))
      .catch((err) => {
        toast({
          title: "Error fetching contacts",
          description: err.message,
        });
      });
  }, []);
   

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleAddLeadClick = () => {
    setLeadToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditLead = (lead) => {
    setLeadToEdit(lead);
    setIsFormOpen(true);
  };

  // Delete both contact and associated lead
  const handleDeleteLead = async (lead) => {
    const token = localStorage.getItem('access_token');
    try {
      // Delete lead (if you want to delete lead first, uncomment below)
      // await fetch(`http://localhost:5555/leads/${lead.lead_id || lead.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     ...(token && { 'Authorization': `Bearer ${token}` }),
      //   },
      // });
      // Delete contact (which should cascade delete the lead)
      await fetch(`http://localhost:5555/contacts/${lead.id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      // Refresh leads
      const res = await fetch('http://localhost:5555/contacts/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        method: 'GET',
      });
      const data = await res.json();
      setLeads(data.map(lead => ({
        ...lead,
        status: lead.status || lead.lead_status,
        createdOn: lead.createdOn || (lead.created_at ? new Date(lead.created_at) : undefined)
      })));
      toast({
        title: 'Lead deleted',
        description: 'The contact and associated lead have been deleted.',
      });
    } catch (err) {
      toast({
        title: 'Error deleting',
        description: err.message,
      });
    }
  };

  // After add, fetch contacts again to sync UI
  const handleSaveLead = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('http://localhost:5555/contacts/', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        method: 'GET',
      });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setLeads(data.map(lead => ({
        ...lead,
        status: lead.status || lead.lead_status,
        createdOn: lead.createdOn || (lead.created_at ? new Date(lead.created_at) : undefined)
      })));
      toast({
        title: 'Lead added',
        description: 'A new lead has been added to your list.',
      });
    } catch (err) {
      toast({
        title: 'Error refreshing leads',
        description: err.message,
      });
    }
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddLeadClick={handleAddLeadClick}
        />

        <main className="mt-6">
          {activeTab === 'dashboard' ? (
            <Dashboard leads={leads} />
          ) : (
            <LeadTable
              leads={leads}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          )}
        </main>

        <LeadForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveLead}
          leadToEdit={leadToEdit}
        />
      </div>
    </div>
  );
};

export default Index;
