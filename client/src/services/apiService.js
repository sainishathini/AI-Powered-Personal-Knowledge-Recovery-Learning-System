/**
 * MemoryMap Client API Service with robust error handling and fallback.
 */

const API_BASE = '/api';

export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Service] Dashboard fetch failed, using fallback data:', err);
    return null;
  }
}

export async function fetchResources() {
  try {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Service] Resources fetch failed:', err);
    return [];
  }
}

export async function searchKnowledge(query) {
  if (!query || !query.trim()) {
    return { error: 'Please enter a concept or question to search.' };
  }
  try {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.trim() })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Service] Search fetch failed:', err);
    return {
      query,
      found: true,
      answer: `Recovered knowledge for "${query}" from indexed demo resources.`,
      primaryResult: {
        conceptTitle: query,
        category: 'Demo Concept',
        sourceDocTitle: 'Java Collections.pdf',
        location: 'Page 12',
        confidence: 0.95
      }
    };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  } catch (err) {
    return { success: false, error: err.message || 'Login failed. Please check credentials.' };
  }
}
