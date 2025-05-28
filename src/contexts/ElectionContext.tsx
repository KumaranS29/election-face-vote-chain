
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  party: string;
  manifesto: string;
  electionId: string;
  votes: number;
  image?: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
  totalVotes: number;
}

interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  voterId: string;
  timestamp: string;
  verified: boolean;
}

interface ElectionContextType {
  elections: Election[];
  votes: Vote[];
  createElection: (election: Omit<Election, 'id' | 'candidates' | 'totalVotes'>) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  submitVote: (electionId: string, candidateId: string, voterId: string) => boolean;
  getElectionResults: (electionId: string) => { candidate: Candidate; percentage: number }[];
  updateElectionStatus: (electionId: string, status: Election['status']) => void;
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

  useEffect(() => {
    // Load data from localStorage
    const storedElections = localStorage.getItem('voting_elections');
    const storedVotes = localStorage.getItem('voting_votes');
    
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    } else {
      // Initialize with sample election
      const sampleElection: Election = {
        id: 'election-1',
        title: 'Presidential Election 2024',
        description: 'National Presidential Election',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        candidates: [],
        totalVotes: 0
      };
      setElections([sampleElection]);
      localStorage.setItem('voting_elections', JSON.stringify([sampleElection]));
    }
    
    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    }
  }, []);

  const createElection = (electionData: Omit<Election, 'id' | 'candidates' | 'totalVotes'>) => {
    const newElection: Election = {
      ...electionData,
      id: `election-${Date.now()}`,
      candidates: [],
      totalVotes: 0
    };
    
    const updatedElections = [...elections, newElection];
    setElections(updatedElections);
    localStorage.setItem('voting_elections', JSON.stringify(updatedElections));
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}`,
      votes: 0
    };
    
    const updatedElections = elections.map(election => {
      if (election.id === candidateData.electionId) {
        return {
          ...election,
          candidates: [...election.candidates, newCandidate]
        };
      }
      return election;
    });
    
    setElections(updatedElections);
    localStorage.setItem('voting_elections', JSON.stringify(updatedElections));
  };

  const submitVote = (electionId: string, candidateId: string, voterId: string): boolean => {
    // Check if voter has already voted
    const existingVote = votes.find(vote => vote.electionId === electionId && vote.voterId === voterId);
    if (existingVote) {
      return false;
    }
    
    const newVote: Vote = {
      id: `vote-${Date.now()}`,
      electionId,
      candidateId,
      voterId,
      timestamp: new Date().toISOString(),
      verified: true
    };
    
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    localStorage.setItem('voting_votes', JSON.stringify(updatedVotes));
    
    // Update election and candidate vote counts
    const updatedElections = elections.map(election => {
      if (election.id === electionId) {
        const updatedCandidates = election.candidates.map(candidate => {
          if (candidate.id === candidateId) {
            return { ...candidate, votes: candidate.votes + 1 };
          }
          return candidate;
        });
        
        return {
          ...election,
          candidates: updatedCandidates,
          totalVotes: election.totalVotes + 1
        };
      }
      return election;
    });
    
    setElections(updatedElections);
    localStorage.setItem('voting_elections', JSON.stringify(updatedElections));
    
    return true;
  };

  const getElectionResults = (electionId: string): { candidate: Candidate; percentage: number }[] => {
    const election = elections.find(e => e.id === electionId);
    if (!election || election.totalVotes === 0) return [];
    
    return election.candidates.map(candidate => ({
      candidate,
      percentage: (candidate.votes / election.totalVotes) * 100
    })).sort((a, b) => b.candidate.votes - a.candidate.votes);
  };

  const updateElectionStatus = (electionId: string, status: Election['status']) => {
    const updatedElections = elections.map(election => {
      if (election.id === electionId) {
        return { ...election, status };
      }
      return election;
    });
    
    setElections(updatedElections);
    localStorage.setItem('voting_elections', JSON.stringify(updatedElections));
  };

  const value = {
    elections,
    votes,
    createElection,
    addCandidate,
    submitVote,
    getElectionResults,
    updateElectionStatus
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
