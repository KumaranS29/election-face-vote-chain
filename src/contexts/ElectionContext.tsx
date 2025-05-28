
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Candidate {
  id: string;
  name: string;
  email: string;
  party: string;
  manifesto: string;
  election_id: string;
  votes: number;
  image_url?: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
  total_votes: number;
}

interface Vote {
  id: string;
  election_id: string;
  candidate_id: string;
  voter_id: string;
  timestamp: string;
  verified: boolean;
  face_verification_data?: any;
}

interface ElectionContextType {
  elections: Election[];
  votes: Vote[];
  loading: boolean;
  createElection: (election: Omit<Election, 'id' | 'candidates' | 'total_votes'>) => Promise<boolean>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => Promise<boolean>;
  submitVote: (electionId: string, candidateId: string, voterId: string, faceData?: any) => Promise<boolean>;
  getElectionResults: (electionId: string) => { candidate: Candidate; percentage: number }[];
  updateElectionStatus: (electionId: string, status: Election['status']) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchElections = async () => {
    try {
      const { data: electionsData, error } = await supabase
        .from('elections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const electionsWithCandidates = await Promise.all(
        (electionsData || []).map(async (election) => {
          const { data: candidates } = await supabase
            .from('candidates')
            .select('*')
            .eq('election_id', election.id);

          return {
            ...election,
            candidates: candidates || []
          };
        })
      );

      setElections(electionsWithCandidates);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const fetchVotes = async () => {
    if (!user) return;
    
    try {
      const { data: votesData, error } = await supabase
        .from('votes')
        .select('*')
        .eq('voter_id', user.id);

      if (error) throw error;
      setVotes(votesData || []);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchElections(), fetchVotes()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const createElection = async (electionData: Omit<Election, 'id' | 'candidates' | 'total_votes'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('elections')
        .insert([{
          ...electionData,
          created_by: user?.id
        }]);

      if (error) throw error;
      await fetchElections();
      return true;
    } catch (error) {
      console.error('Error creating election:', error);
      return false;
    }
  };

  const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'votes'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidates')
        .insert([{
          ...candidateData,
          user_id: user?.id
        }]);

      if (error) throw error;
      await fetchElections();
      return true;
    } catch (error) {
      console.error('Error adding candidate:', error);
      return false;
    }
  };

  const submitVote = async (electionId: string, candidateId: string, voterId: string, faceData?: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('votes')
        .insert([{
          election_id: electionId,
          candidate_id: candidateId,
          voter_id: voterId,
          face_verification_data: faceData
        }]);

      if (error) throw error;
      await Promise.all([fetchElections(), fetchVotes()]);
      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      return false;
    }
  };

  const getElectionResults = (electionId: string): { candidate: Candidate; percentage: number }[] => {
    const election = elections.find(e => e.id === electionId);
    if (!election || election.total_votes === 0) return [];
    
    return election.candidates.map(candidate => ({
      candidate,
      percentage: (candidate.votes / election.total_votes) * 100
    })).sort((a, b) => b.candidate.votes - a.candidate.votes);
  };

  const updateElectionStatus = async (electionId: string, status: Election['status']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('elections')
        .update({ status })
        .eq('id', electionId);

      if (error) throw error;
      await fetchElections();
      return true;
    } catch (error) {
      console.error('Error updating election status:', error);
      return false;
    }
  };

  const value = {
    elections,
    votes,
    loading,
    createElection,
    addCandidate,
    submitVote,
    getElectionResults,
    updateElectionStatus,
    refreshData
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
