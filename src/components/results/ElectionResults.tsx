
import React from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Vote, Users, TrendingUp } from 'lucide-react';

interface ElectionResultsProps {
  electionId: string;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ electionId }) => {
  const { elections, getElectionResults } = useElection();
  
  const election = elections.find(e => e.id === electionId);
  const results = getElectionResults(electionId);

  if (!election) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Election Not Found</h1>
          <p className="text-gray-600 mt-2">The requested election could not be found.</p>
        </div>
      </div>
    );
  }

  const winner = results.length > 0 ? results[0] : null;
  const chartData = results.map(result => ({
    name: result.candidate.name,
    votes: result.candidate.votes,
    percentage: result.percentage
  }));

  const pieData = results.map((result, index) => ({
    name: result.candidate.name,
    value: result.candidate.votes,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{election.title} - Results</h1>
        <p className="text-gray-600 mt-2">{election.description}</p>
        <Badge variant={election.status === 'completed' ? 'secondary' : 'default'} className="mt-4">
          {election.status}
        </Badge>
      </div>

      {/* Election Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Votes</p>
                <p className="text-3xl font-bold text-blue-900">{election.total_votes}</p>
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
                <p className="text-green-600 text-sm font-medium">Candidates</p>
                <p className="text-3xl font-bold text-green-900">{election.candidates.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Winner</p>
                <p className="text-lg font-bold text-purple-900">
                  {winner ? winner.candidate.name.split(' ')[0] : 'TBD'}
                </p>
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
                <p className="text-orange-600 text-sm font-medium">Turnout</p>
                <p className="text-3xl font-bold text-orange-900">
                  {election.total_votes > 0 ? '78%' : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winner Announcement */}
      {winner && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Winner</h2>
              <h3 className="text-3xl font-bold text-yellow-700 mb-2">{winner.candidate.name}</h3>
              <p className="text-xl text-gray-700 mb-2">{winner.candidate.party}</p>
              <div className="flex justify-center space-x-8 text-lg">
                <div>
                  <span className="font-semibold">{winner.candidate.votes}</span>
                  <span className="text-gray-600 ml-1">votes</span>
                </div>
                <div>
                  <span className="font-semibold">{winner.percentage.toFixed(1)}%</span>
                  <span className="text-gray-600 ml-1">of total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>Number of votes received by each candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Share</CardTitle>
            <CardDescription>Percentage breakdown of votes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Complete breakdown of election results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">Candidate</th>
                  <th className="text-left py-3 px-4 font-semibold">Party</th>
                  <th className="text-right py-3 px-4 font-semibold">Votes</th>
                  <th className="text-right py-3 px-4 font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.candidate.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">#{index + 1}</span>
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{result.candidate.name}</td>
                    <td className="py-3 px-4 text-gray-600">{result.candidate.party}</td>
                    <td className="py-3 px-4 text-right font-semibold">{result.candidate.votes}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {result.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Election Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Election Timeline</CardTitle>
          <CardDescription>Key dates and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium">Election Started</div>
                <div className="text-sm text-gray-600">
                  {new Date(election.start_date).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Election Ended</div>
                <div className="text-sm text-gray-600">
                  {new Date(election.end_date).toLocaleString()}
                </div>
              </div>
            </div>
            {election.status === 'completed' && (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Results Declared</div>
                  <div className="text-sm text-gray-600">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionResults;
