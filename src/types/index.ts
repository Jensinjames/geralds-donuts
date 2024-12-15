export interface Order {
  id: number;
  status: 'pending' | 'in-progress' | 'completed';
  items: string[];
  timestamp: string;
}

export interface Analytics {
  totalOrders: number;
  averageResponseTime: string;
  successRate: string;
}

export interface VoiceLog {
  id: number;
  transcript: string;
  timestamp: string;
}