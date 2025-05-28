
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useElection } from '../../contexts/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vote, Trophy, Users, TrendingUp, Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { elections, addCandidate } = useElection();
  const { toast } = useToast();
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedElection, setSelectedElection] = useState('');
  const [party, setParty] = useState('');
  const [manifesto, setManifesto] = useState('');

  const availableElections = elections.filter(e => e.status !== 'completed');
  const appliedElections = elections.filter(election => 
    election.candidates.some(candidate => candidate.email === user?.email)
  );

  const myCandidacies = appliedElections.map(election => {
    const candidate = election.candidates.find(c => c.email === user?.email);
    return {
      election,
      candidate: candidate!
    };
  });

  const totalVotes = myCandidacies.reduce((acc, { candidate }) => acc + candidate.votes, 0);
  const wonElections = myCandidacies.filter(({ election, candidate }) => {
    if (election.status !== 'completed') return false;
    const maxVotes = Math.max(...election.candidates.map(c => c.votes));
    return candidate.votes === maxVotes && maxVotes > 0;
  }).length;

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedElection || !party || !manifesto) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const election = elections.find(e => e.id === selectedElection);
    if (!election) return;

    // Check if already applied
    const alreadyApplied = election.candidates.some(c => c.email === user.email);
    if (alreadyApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this election.",
        variant: "destructive"
      });
      return;
    }

    addCandidate({
      name: user.name,
      email: user.email,
      party,
      manifesto,
      electionId: selectedElection
    });

    toast({
      title: "Application Submitted",
      description: "Your candidacy application has been submitted successfully!",
      variant: "default"
    });

    setShowApplicationForm(false);
    setSelectedElection('');
    setParty('');
    setManifesto('');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your election campaigns and track performance</p>
        </div>
        <Button
          onClick={() => setShowApplicationForm(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Apply for Election
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Applications</p>
                <p className="text-3xl font-bold text-blue-900">{myCandidacies.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Votes</p>
                <p className="text-3xl font-bold text-green-900">{totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Elections Won</p>
                <p className="text-3xl font-bold text-purple-900">{wonElections}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Win Rate</p>
                <p className="text-3xl font-bold text-orange-900">
                  {myCandidacies.length > 0 ? Math.round((wonElections / myCandidacies.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Candidacies */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">My Candidacies</h2>
        
        {myCandidacies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">Apply for elections to start your political campaign.</p>
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                Apply for Election
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {myCandidacies.map(({ election, candidate }) => (
              <Card key={election.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <CardDescription className="mt-2">{election.description}</CardDescription>
                    </div>
                    <Badge variant={
                      election.status === 'active' ? 'default' :
                      election.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {election.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Campaign Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Party:</strong> {candidate.party}</div>
                        <div><strong>Manifesto:</strong></div>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">{candidate.manifesto}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Performance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-600">Votes Received</span>
                          <span className="font-bold text-blue-900">{candidate.votes}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-purple-600">Vote Percentage</span>
                          <span className="font-bold text-purple-900">
                            {election.totalVotes > 0 
                              ? `${((candidate.votes / election.totalVotes) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Total Candidates</span>
                          <span className="font-bold text-gray-900">{election.candidates.length}</span>
                        </div>
                        
                        {election.status === 'completed' && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-green-600">Ranking</span>
                            <span className="font-bold text-green-900">
                              #{election.candidates
                                .sort((a, b) => b.votes - a.votes)
                                .findIndex(c => c.id === candidate.id) + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Apply for Election</CardTitle>
              <CardDescription>
                Submit your candidacy application for an upcoming or active election.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="election">Select Election</Label>
                  <Select value={selectedElection} onValueChange={setSelectedElection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableElections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title} - {election.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party">Political Party</Label>
                  <Input
                    id="party"
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    placeholder="Enter your political party"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Election Manifesto</Label>
                  <Textarea
                    id="manifesto"
                    value={manifesto}
                    onChange={(e) => setManifesto(e.target.value)}
                    placeholder="Describe your vision, policies, and what you plan to achieve..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-700"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
