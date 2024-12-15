import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { Activity, MessageSquare, Package } from 'lucide-react';

const fetchOrders = async () => {
  // Mock API call
  return [
    { id: 1, status: 'pending', items: ['Glazed Donut', 'Chocolate Donut'], timestamp: new Date().toISOString() },
    { id: 2, status: 'completed', items: ['Strawberry Donut'], timestamp: new Date().toISOString() },
  ];
};

const fetchAnalytics = async () => {
  // Mock API call
  return {
    totalOrders: 150,
    averageResponseTime: '2.3s',
    successRate: '98%',
  };
};

const fetchVoiceLogs = async () => {
  // Mock API call
  return [
    { id: 1, transcript: "I'd like to order a dozen glazed donuts", timestamp: new Date().toISOString() },
    { id: 2, transcript: "Can I get a chocolate donut?", timestamp: new Date().toISOString() },
  ];
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  const { data: voiceLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['voiceLogs'],
    queryFn: fetchVoiceLogs,
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

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="voice-logs">Voice Logs</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {ordersLoading ? (
            <Card className="p-6 shimmer">
              <div className="h-20 bg-muted rounded-md"></div>
            </Card>
          ) : (
            orders?.map((order) => (
              <Card key={order.id} className="p-6 card-hover">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.items.join(', ')}</p>
                  </div>
                  <Button variant="outline">{order.status}</Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="voice-logs" className="space-y-4">
          {logsLoading ? (
            <Card className="p-6 shimmer">
              <div className="h-20 bg-muted rounded-md"></div>
            </Card>
          ) : (
            voiceLogs?.map((log) => (
              <Card key={log.id} className="p-6 card-hover">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                <p className="font-medium">{log.transcript}</p>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Available Endpoints</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">POST /api/orders</p>
                <p className="text-sm text-muted-foreground mt-2">Create a new order</p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">GET /api/analytics</p>
                <p className="text-sm text-muted-foreground mt-2">Retrieve analytics data</p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="font-mono text-sm">GET /api/voice-logs</p>
                <p className="text-sm text-muted-foreground mt-2">Fetch voice interaction logs</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}