import { useState, useEffect } from 'react';
import { fetchDashboard, fetchResources } from '../services/apiService';

export function useKnowledgeData() {
  const [data, setData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [dash, res] = await Promise.all([fetchDashboard(), fetchResources()]);
        if (isMounted) {
          setData(dash);
          setResources(res || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to connect to backend.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return { data, resources, loading, error };
}
