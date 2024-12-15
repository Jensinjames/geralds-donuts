import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { Activity, MessageSquare, Package } from 'lucide-react';
import { Comments } from './Comments';
import { ActivityList } from './ActivityList';

const fetchAnalytics = async () => {
  // Mock API call
  return {
    totalOrders: 150,
    averageResponseTime: '2.3s',
    successRate: '98%',
  };
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('activity');

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <h1 className="text-4xl font-display font-bold mb-8">Sandbox Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 card-hover">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">{analytics?.totalOrders || '-'}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 card-hover">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <h3 className="text-2xl font-bold">{analytics?.averageResponseTime || '-'}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 card-hover">
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <h3 className="text-2xl font-bold">{analytics?.successRate || '-'}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <ActivityList />
        </TabsContent>

        <TabsContent value="comments">
          <Comments />
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Available Endpoints</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">GET /api/comments</p>
                <p className="text-sm text-muted-foreground mt-2">Fetch comments</p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">GET /api/activity</p>
                <p className="text-sm text-muted-foreground mt-2">Fetch activity logs</p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">POST /api/comments</p>
                <p className="text-sm text-muted-foreground mt-2">Create a new comment</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}