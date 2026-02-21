import { useEffect, useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    fetch(`${apiBaseUrl}/health`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Health probe failed')))
      .then((data) => setHealth(`${data.status} / db:${data.database}`))
      .catch(() => setHealth('unavailable'));
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', margin: '2rem', maxWidth: '760px' }}>
      <h1>Cloud Project Management Tool</h1>
      <p>Frontend is designed for S3 + CloudFront hosting.</p>
      <ul>
        <li>API Base URL: {apiBaseUrl}</li>
        <li>Service Health: {health}</li>
      </ul>
    </main>
  );
}