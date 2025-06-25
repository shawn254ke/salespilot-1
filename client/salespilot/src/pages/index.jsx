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

  const handleDeleteLead = (id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
    toast({
      title: "Lead deleted",
      description: "The lead has been removed from your list.",
    });
  };

  const handleSaveLead = (lead) => {
    if (leadToEdit) {
      // Update existing lead
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === lead.id ? lead : l))
      );
      toast({
        title: "Lead updated",
        description: "The lead information has been updated successfully.",
      });
    } else {
      // Add new lead
      setLeads((prevLeads) => [...prevLeads, lead]);
      toast({
        title: "Lead added",
        description: "A new lead has been added to your list.",
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
