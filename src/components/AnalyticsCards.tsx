import { Activity, MessageSquare, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const fetchAnalytics = async () => {
  // Mock API call
  return {
    totalOrders: 150,
    averageResponseTime: '2.3s',
    successRate: '98%',
  };
};

export function AnalyticsCards() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  });

  return (
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
  );
}