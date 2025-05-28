
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useElection } from '../../contexts/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, CheckCircle, Clock, Trophy, Camera, Shield, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FaceVerificationModal from './FaceVerificationModal';

const VoterDashboard = () => {
  const { user } = useAuth();
  const { elections, votes, submitVote, loading, refreshData } = useElection();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [votingElectionId, setVotingElectionId] = useState<string | null>(null);
  const [submittingVote, setSubmittingVote] = useState(false);

  const activeElections = elections.filter(e => e.status === 'active');
  const userVotes = votes.filter(v => v.voter_id === user?.id);
  const votedElectionIds = new Set(userVotes.map(v => v.election_id));

  const handleVoteClick = (electionId: string, candidateId: string) => {
    if (!user) return;
    
    if (votedElectionIds.has(electionId)) {
      toast({
        title: "Already Voted",
        description: "You have already voted in this election.",
        variant: "destructive"
      });
      return;
    }

    setSelectedCandidate(candidateId);
    setVotingElectionId(electionId);
    setShowFaceVerification(true);
  };

  const handleFaceVerificationSuccess = async (faceData?: any) => {
    if (!user || !votingElectionId || !selectedCandidate) return;

    setSubmittingVote(true);
    
    try {
      const success = await submitVote(votingElectionId, selectedCandidate, user.id, faceData);
      
      if (success) {
        toast({
          title: "Vote Submitted",
          description: "Your vote has been recorded successfully!",
          variant: "default"
        });
        await refreshData(); // Refresh data to show updated vote counts
      } else {
        toast({
          title: "Vote Failed",
          description: "Failed to submit your vote. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting your vote.",
        variant: "destructive"
      });
    } finally {
      setSubmittingVote(false);
      setShowFaceVerification(false);
      setSelectedCandidate(null);
      setVotingElectionId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Voter Dashboard</h1>
        <p className="text-gray-600 mt-2">Cast your vote in active elections</p>
      </div>

      {/* Voting Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Vote className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900">Active Elections</h3>
            <p className="text-2xl font-bold text-blue-800">{activeElections.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900">Votes Cast</h3>
            <p className="text-2xl font-bold text-green-800">{userVotes.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-purple-900">Security Status</h3>
            <p className="text-sm font-bold text-purple-800">Face Verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Elections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Elections</h2>
        
        {activeElections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Elections</h3>
              <p className="text-gray-600">There are currently no active elections to vote in.</p>
            </CardContent>
          </Card>
        ) : (
          activeElections.map((election) => {
            const hasVoted = votedElectionIds.has(election.id);
            const userVote = userVotes.find(v => v.election_id === election.id);
            const votedCandidate = userVote 
              ? election.candidates.find(c => c.id === userVote.candidate_id)
              : null;

            return (
              <Card key={election.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <CardDescription className="mt-2">{election.description}</CardDescription>
                    </div>
                    {hasVoted && (
                      <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Voted</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {hasVoted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Vote Submitted Successfully</h3>
                      <p className="text-gray-600 mb-4">
                        You voted for: <span className="font-semibold text-green-600">{votedCandidate?.name}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Voted on: {new Date(userVote!.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-semibold text-lg">Choose Your Candidate</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Camera className="w-4 h-4" />
                          <span>Face verification required</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {election.candidates.map((candidate) => (
                          <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-semibold text-lg">{candidate.name}</h5>
                                <p className="text-blue-600 font-medium">{candidate.party}</p>
                                <p className="text-gray-600 text-sm mt-2">{candidate.manifesto}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                  Current votes: {candidate.votes}
                                </div>
                              </div>
                              <Button
                                onClick={() => handleVoteClick(election.id, candidate.id)}
                                className="ml-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                disabled={submittingVote}
                              >
                                <Vote className="w-4 h-4 mr-2" />
                                Vote
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {election.candidates.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-3" />
                          <p>No candidates have been registered for this election yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Voting History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Voting History</h2>
        
        {userVotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Voting History</h3>
              <p className="text-gray-600">You haven't cast any votes yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {userVotes.map((vote) => {
              const election = elections.find(e => e.id === vote.election_id);
              const candidate = election?.candidates.find(c => c.id === vote.candidate_id);
              
              return (
                <Card key={vote.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{election?.title}</h4>
                        <p className="text-sm text-gray-600">
                          Voted for: <span className="font-medium text-green-600">{candidate?.name}</span>
                        </p>
                        {vote.verified && (
                          <p className="text-xs text-blue-600 flex items-center mt-1">
                            <Shield className="w-3 h-3 mr-1" />
                            Face verified
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{new Date(vote.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(vote.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Face Verification Modal */}
      {showFaceVerification && (
        <FaceVerificationModal
          isOpen={showFaceVerification}
          onClose={() => {
            setShowFaceVerification(false);
            setSelectedCandidate(null);
            setVotingElectionId(null);
          }}
          onSuccess={handleFaceVerificationSuccess}
        />
      )}
    </div>
  );
};

export default VoterDashboard;
