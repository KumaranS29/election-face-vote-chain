
import React, { useState } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateElectionFormProps {
  onClose: () => void;
}

const CreateElectionForm: React.FC<CreateElectionFormProps> = ({ onClose }) => {
  const { createElection } = useElection();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast({
        title: "Date Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const start = new Date(startDate);
      const status = start > now ? 'upcoming' : 'active';

      const success = await createElection({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status
      });

      if (success) {
        toast({
          title: "Election Created",
          description: "New election has been created successfully.",
          variant: "default"
        });
        onClose();
      } else {
        toast({
          title: "Creation Failed",
          description: "Failed to create election. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the election.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
          <DialogDescription>
            Set up a new election with candidates and voting periods.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Election Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Presidential Election 2024"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this election..."
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Election'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateElectionForm;
