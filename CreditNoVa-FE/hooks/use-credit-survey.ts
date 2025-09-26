import { useState, useEffect } from 'react';
import { creditSurveyApi, CreditSurvey } from '@/lib/api';

// Type for creating new surveys (without id, createdAt, updatedAt)
type CreditSurveyDTO = Omit<CreditSurvey, 'id' | 'createdAt' | 'updatedAt'>;
import { useToast } from '@/hooks/use-toast';

// Hook for managing multiple surveys
export function useCreditSurveys() {
  const [surveys, setSurveys] = useState<CreditSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditSurveyApi.getAll();
      
      if (response.success && response.data) {
        setSurveys(response.data);
      } else {
        const errorMessage = response.error || 'Failed to fetch surveys';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch surveys';
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
    fetchSurveys();
  }, []);

  const createSurvey = async (surveyData: CreditSurveyDTO) => {
    try {
      const response = await creditSurveyApi.create(surveyData);
      
      if (response.success && response.data) {
        setSurveys(prev => [...prev, response.data]);
        toast({
          title: "Success",
          description: "Survey created successfully",
        });
        return response.data;
      } else {
        const errorMessage = response.error || 'Failed to create survey';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create survey';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      const response = await creditSurveyApi.delete(id);
      
      if (response.success) {
        setSurveys(prev => prev.filter(survey => survey.id !== id));
        toast({
          title: "Success",
          description: "Survey deleted successfully",
        });
      } else {
        const errorMessage = response.error || 'Failed to delete survey';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete survey';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    surveys,
    loading,
    error,
    createSurvey,
    deleteSurvey,
    refetch: fetchSurveys,
  };
}

// Hook for managing a single survey
export function useCreditSurvey(id: string | null) {
  const [survey, setSurvey] = useState<CreditSurvey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSurvey = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await creditSurveyApi.getById(id);
      
      if (response.success && response.data) {
        setSurvey(response.data);
      } else {
        const errorMessage = response.error || 'Failed to fetch survey';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch survey';
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
    fetchSurvey();
  }, [id]);

  const updateSurvey = async (updates: Partial<CreditSurvey>) => {
    if (!id) return;
    
    try {
      const response = await creditSurveyApi.update(id, updates);
      
      if (response.success && response.data) {
        setSurvey(response.data);
        toast({
          title: "Success",
          description: "Survey updated successfully",
        });
        return response.data;
      } else {
        const errorMessage = response.error || 'Failed to update survey';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update survey';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };


  return {
    survey,
    loading,
    error,
    updateSurvey,
    refetch: fetchSurvey,
  };
}

// Hook for form submission
export function useCreateCreditSurvey() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSurvey = async (surveyData: CreditSurveyDTO) => {
    try {
      setLoading(true);
      const response = await creditSurveyApi.create(surveyData);
      
      if (response.success && response.data) {
        toast({
          title: "Success",
          description: "Credit survey submitted successfully",
        });
        return response.data;
      } else {
        const errorMessage = response.error || 'Failed to submit survey';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit survey';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSurvey,
    loading,
  };
}
