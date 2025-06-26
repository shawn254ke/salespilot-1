import React from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const LeadForm = ({
  isOpen,
  onClose,
  onSave,
  leadToEdit,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Website',
    notes: [],
  });

  const [newNote, setNewNote] = React.useState('');

  React.useEffect(() => {
    if (leadToEdit) {
      const { id, createdOn, ...rest } = leadToEdit;
      setFormData(rest);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        source: 'Website',
        notes: [],
      });
    }
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData((prev) => ({
        ...prev,
        notes: [...(Array.isArray(prev.notes) ? prev.notes : []), newNote.trim()],
      }));
      setNewNote('');
    }
  };

  const handleRemoveNote = (index) => {
    setFormData((prev) => ({
      ...prev,
      notes: (Array.isArray(prev.notes) ? prev.notes : []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      if (leadToEdit) {
        // PATCH contact
        const contactRes = await fetch(`http://localhost:5555/contacts/${leadToEdit.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
          })
        });
        const contactData = await contactRes.json();
        if (!contactRes.ok) throw new Error(contactData.error || 'Failed to update contact');

        // PATCH lead status (find lead id from leadToEdit.lead_id or similar)
        // If leadToEdit.lead_id is not present, fallback to leadToEdit.id
        const leadId = leadToEdit.lead_id || leadToEdit.id;
        const leadRes = await fetch(`http://localhost:5555/leads/${leadId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            status: formData.status,
          })
        });
        const leadData = await leadRes.json();
        if (!leadRes.ok) throw new Error(leadData.error || 'Failed to update lead');

        onSave();
      } else {
        // 1. Create or get contact
        const contactRes = await fetch('http://localhost:5555/contacts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
          })
        });
        const contactData = await contactRes.json();
        if (!contactRes.ok && contactData.error !== 'Contact with this email already exists') {
          throw new Error(contactData.error || 'Failed to create contact');
        }

        // 2. Get contact id (from response or by fetching contacts)
        let contactId = contactData.id;
        if (!contactId) {
          // If contact already exists, fetch contacts to get the id
          const contactsRes = await fetch('http://localhost:5555/contacts/', {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          });
          const contacts = await contactsRes.json();
          const found = contacts.find(c => c.email === formData.email);
          if (!found) throw new Error('Contact not found after creation');
          contactId = found.id;
        }

        // 3. Create lead for this contact
        const leadRes = await fetch('http://localhost:5555/leads/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            contact_id: contactId,
            status: formData.status,
          })
        });
        const leadData = await leadRes.json();
        if (!leadRes.ok) throw new Error(leadData.error || 'Failed to create lead');

        onSave();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const statusOptions = [
    'New',
    'Contacted',
    'Interested',
    'Converted',
    'Lost',
  ];

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{leadToEdit ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange('status', value)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
             
            </div>
            
            <div className="space-y-2">
              <Label>Notes</Label>
              <div className="flex space-x-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                />
                <Button type="button" onClick={handleAddNote}>
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {(Array.isArray(formData.notes) && formData.notes.length > 0) ? (
                  <ul className="space-y-1">
                    {formData.notes.map((note, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <span className="text-sm">{note}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNote(index)}
                          className="h-6 w-6 p-0"
                        >
                          &times;
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes added yet</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{leadToEdit ? 'Update' : 'Add'} Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadForm;
