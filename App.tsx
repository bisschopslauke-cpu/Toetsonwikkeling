import React from 'react';

function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          De Toetsenmaker
        </h1>
        <p style={{ maxWidth: '48rem', lineHeight: 1.5 }}>
          Dit is een testversie van <strong>De Toetsenmaker</strong>. 
          De echte AI-logica komt later, maar deze pagina bewijst dat de app
          technisch goed draait op GitHub &amp; Vercel.
        </p>
      </header>

      <section
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Demo-scherm
        </h2>
        <p style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
          Hier komt straks de interface waarin je:
        </p>
        <ul style={{ marginLeft: '1.25rem', marginBottom: '1rem', lineHeight: 1.5 }}>
          <li>toetsvragen laat genereren op Basis- of Blooms-niveau,</li>
          <li>feedback en modelantwoorden ziet,</li>
          <li>vragen kunt bijschaven en exporteren.</li>
        </ul>
        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Als je deze tekst nu in je browser ziet, dan werkt de app. 🎉
        </p>
      </section>
    </main>
  );
}

export default App;
