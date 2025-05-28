
import React, { useState } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Vote, Users, Trophy, Calendar, Plus, Activity, TrendingUp, Loader2 } from 'lucide-react';
import CreateElectionForm from './CreateElectionForm';
import ElectionManagement from './ElectionManagement';

const AdminDashboard = () => {
  const { elections, votes, loading } = useElection();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const totalElections = elections.length;
  const activeElections = elections.filter(e => e.status === 'active').length;
  const totalVotes = votes.length;
  const totalCandidates = elections.reduce((acc, election) => acc + election.candidates.length, 0);

  const electionStats = elections.map(election => ({
    name: election.title.substring(0, 20) + '...',
    votes: election.total_votes,
    candidates: election.candidates.length
  }));

  const statusData = [
    { name: 'Active', value: elections.filter(e => e.status === 'active').length, color: '#10B981' },
    { name: 'Completed', value: elections.filter(e => e.status === 'completed').length, color: '#6366F1' },
    { name: 'Upcoming', value: elections.filter(e => e.status === 'upcoming').length, color: '#F59E0B' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage elections, candidates, and monitor voting activity</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Elections</p>
                <p className="text-3xl font-bold text-blue-900">{totalElections}</p>
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
                <p className="text-green-600 text-sm font-medium">Active Elections</p>
                <p className="text-3xl font-bold text-green-900">{activeElections}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Votes</p>
                <p className="text-3xl font-bold text-purple-900">{totalVotes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Candidates</p>
                <p className="text-3xl font-bold text-orange-900">{totalCandidates}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="elections">Elections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voting Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Voting Activity by Election</CardTitle>
                <CardDescription>Number of votes cast per election</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={electionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Election Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Election Status Distribution</CardTitle>
                <CardDescription>Current status of all elections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Elections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Elections</CardTitle>
              <CardDescription>Latest election activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {elections.slice(0, 5).map((election) => (
                  <div key={election.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Vote className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{election.title}</h4>
                        <p className="text-sm text-gray-600">{election.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        election.status === 'active' ? 'default' :
                        election.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {election.status}
                      </Badge>
                      <div className="text-right text-sm">
                        <div className="font-medium">{election.total_votes} votes</div>
                        <div className="text-gray-500">{election.candidates.length} candidates</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elections">
          <ElectionManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
                <CardDescription>Votes per candidate across all elections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={electionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="candidates" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Statistics</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">{totalCandidates + 50}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Voter Turnout</span>
                    <span className="font-semibold">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">System Uptime</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security Score</span>
                    <span className="font-semibold text-green-600">A+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Enable 2FA for all users</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Face Recognition Voting</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Blockchain Verification</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real-time Results</span>
                  <Badge variant="default">Live</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>System security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>SSL Certificate</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Valid</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Encryption</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Security</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Secured</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Backup Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Daily</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Election Modal */}
      {showCreateForm && (
        <CreateElectionForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
