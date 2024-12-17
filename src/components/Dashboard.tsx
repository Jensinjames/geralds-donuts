import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { Comments } from './Comments';
import { ActivityList } from './ActivityList';
import { ConversationHistory } from './ConversationHistory';
import { AnalyticsCards } from './AnalyticsCards';
import { ApiEndpoints } from './ApiEndpoints';
import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-display font-bold">Sandbox Dashboard</h1>
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <AnalyticsCards />

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <ActivityList />
        </TabsContent>

        <TabsContent value="conversations">
          <ConversationHistory />
        </TabsContent>

        <TabsContent value="comments">
          <Comments />
        </TabsContent>

        <TabsContent value="endpoints">
          <ApiEndpoints />
        </TabsContent>
      </Tabs>
    </div>
  );
}