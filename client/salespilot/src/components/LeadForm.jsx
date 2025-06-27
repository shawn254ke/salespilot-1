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
    tasks: [],
  });

  // For new task input fields
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    due_date: '',
  });

  React.useEffect(() => {
    const fetchTasks = async (contactId) => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await fetch('http://localhost:5555/tasks/', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const allTasks = await res.json();
        // Only tasks for this contact
        return allTasks.filter((t) => t.contact_id === contactId);
      } catch (err) {
        return [];
      }
    };

    if (leadToEdit) {
      const { id, createdOn, ...rest } = leadToEdit;
      fetchTasks(id).then((tasks) => {
        setFormData({
          ...rest,
          tasks: tasks || [],
        });
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        source: 'Website',
        tasks: [],
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


  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        tasks: [...(Array.isArray(prev.tasks) ? prev.tasks : []), { ...newTask }],
      }));
      setNewTask({ title: '', description: '', due_date: '' });
    }
  };


  const handleRemoveTask = async (index) => {
    const task = formData.tasks[index];
    if (task && task.id) {
      const token = localStorage.getItem('access_token');
      try {
        const res = await fetch(`http://localhost:5555/tasks/${task.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error('Failed to delete task');
      } catch (err) {
        alert('Failed to delete task');
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      tasks: (Array.isArray(prev.tasks) ? prev.tasks : []).filter((_, i) => i !== index),
    }));
  };

  // Mark a task as complete (PATCH to backend and update UI)
  const handleCompleteTask = async (task, idx) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:5555/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ completed: true })
      });
      if (!res.ok) throw new Error('Failed to mark task complete');
      setFormData((prev) => {
        const updated = [...prev.tasks];
        updated[idx] = { ...updated[idx], completed: true };
        return { ...prev, tasks: updated };
      });
    } catch (err) {
      alert('Failed to mark task complete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      let contactId;
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
        contactId = leadToEdit.id;

        // PATCH lead status (find lead id from leadToEdit.lead_id or similar)
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
        contactId = contactData.id;
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
      }

      // Save tasks to backend for this contact
      for (const task of formData.tasks) {
        if (task.title) {
          if (task.id) {
            // Update existing task
            await fetch(`http://localhost:5555/tasks/${task.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
              },
              body: JSON.stringify({
                title: task.title,
                description: task.description,
                due_date: task.due_date,
                status: task.status || 'Open',
                completed: !!task.completed,
              })
            });
          } else {
            // Create new task
            await fetch('http://localhost:5555/tasks/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
              },
              body: JSON.stringify({
                contact_id: contactId,
                title: task.title,
                description: task.description,
                due_date: task.due_date,
                status: 'Open',
                completed: false,
              })
            });
          }
        }
      }

      onSave();
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
              <Label>Add Task</Label>
              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                <Input
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskInputChange}
                  placeholder="Task title"
                  className="md:w-1/3"
                />
                <Input
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskInputChange}
                  placeholder="Description"
                  className="md:w-1/3"
                />
                <Input
                  name="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={handleTaskInputChange}
                  className="md:w-1/4"
                />
                <Button type="button" onClick={handleAddTask}>
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {(Array.isArray(formData.tasks) && formData.tasks.length > 0) ? (
                  <ul className="space-y-1">
                    {formData.tasks.map((task, index) => (
                      <li
                        key={task.id || index}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <div>
                          <span className="text-sm font-medium">{task.title}</span>
                          {task.description && <span className="ml-2 text-xs text-muted-foreground">{task.description}</span>}
                          {task.due_date && <span className="ml-2 text-xs text-muted-foreground">Due: {task.due_date}</span>}
                          {task.completed && <span className="ml-2 text-green-600 text-xs font-semibold">(Completed)</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!task.completed && task.id && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteTask(task, index)}
                            >
                              Mark Complete
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTask(index)}
                            className="h-6 w-6 p-0"
                          >
                            &times;
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks added yet</p>
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
