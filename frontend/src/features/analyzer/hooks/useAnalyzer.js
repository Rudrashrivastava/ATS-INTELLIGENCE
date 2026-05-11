import { useState } from 'react';
import * as analyzerApi from '../services/analyzer.api';

export const useAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);

  const handleAnalyze = async (file, jobDesc) => {
    setLoading(true);
    setResult(null);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 5));
    }, 200);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDesc) formData.append('jobDescription', jobDesc);

    try {
      const data = await analyzerApi.analyzeResume(formData, !!jobDesc);
      clearInterval(interval);
      setProgress(100);
      setResult(data);

      const query = (data.strengths && data.strengths.length > 0) ? data.strengths[0] : 'developer';
      
      try {
        const jobData = await analyzerApi.getJobSuggestions(query);
        const compData = await analyzerApi.getCompanies(query);
        
        // Handle logic for mapping suggestions (simplified for now)
        setSuggestedJobs([{ id: 1, title: query, company: 'Nexus', location: 'Remote', salary: '60k-80k' }]);
        if (compData.results) setSuggestedCompanies(compData.results.slice(0, 4));
      } catch (apiErr) {
        console.error('Secondary API error', apiErr);
      }
      return true;
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, progress, result, suggestedJobs, suggestedCompanies, handleAnalyze };
};
