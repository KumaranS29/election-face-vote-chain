
import React, { useState } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vote, Users, Calendar, Trophy, Play, Square, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ElectionManagement = () => {
  const { elections, updateElectionStatus, getElectionResults } = useElection();
  const { toast } = useToast();

  const handleStatusChange = (electionId: string, newStatus: 'upcoming' | 'active' | 'completed') => {
    updateElectionStatus(electionId, newStatus);
    toast({
      title: "Status Updated",
      description: `Election status has been changed to ${newStatus}.`,
      variant: "default"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Calendar className="w-4 h-4" />;
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Election Management</h2>
          <p className="text-gray-600">Manage all elections and their status</p>
        </div>
      </div>

      <div className="grid gap-6">
        {elections.map((election) => {
          const results = getElectionResults(election.id);
          const winner = results.length > 0 ? results[0] : null;

          return (
            <Card key={election.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{election.title}</CardTitle>
                    <CardDescription className="mt-2">{election.description}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(election.status)} flex items-center space-x-1`}>
                    {getStatusIcon(election.status)}
                    <span className="capitalize">{election.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Vote className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-blue-600">Total Votes</div>
                      <div className="font-semibold text-blue-900">{election.total_votes}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm text-green-600">Candidates</div>
                      <div className="font-semibold text-green-900">{election.candidates.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-purple-600">Start Date</div>
                      <div className="font-semibold text-purple-900">
                        {new Date(election.start_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-sm text-orange-600">Leading</div>
                      <div className="font-semibold text-orange-900">
                        {winner ? winner.candidate.name.split(' ')[0] : 'No votes'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidates List */}
                {election.candidates.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Candidates ({election.candidates.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-gray-600">{candidate.party}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{candidate.votes} votes</div>
                            <div className="text-xs text-gray-500">
                              {election.total_votes > 0 
                                ? `${((candidate.votes / election.total_votes) * 100).toFixed(1)}%`
                                : '0%'
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Control */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      value={election.status}
                      onValueChange={(value: 'upcoming' | 'active' | 'completed') => 
                        handleStatusChange(election.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {election.status === 'completed' && (
                      <Button variant="default" size="sm">
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {elections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Elections Found</h3>
            <p className="text-gray-600 mb-4">Create your first election to get started.</p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Create Election
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ElectionManagement;
