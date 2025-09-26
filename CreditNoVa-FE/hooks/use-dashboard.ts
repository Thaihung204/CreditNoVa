import { useState, useEffect } from 'react';
import { creditSurveyApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalSurveys: number;
  completedSurveys: number;
  pendingSurveys: number;
  averageCreditScore: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSurveys: 0,
    completedSurveys: 0,
    pendingSurveys: 0,
    averageCreditScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditSurveyApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats,
  };
}
