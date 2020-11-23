import React from 'react';

import './App.css';
import SentimentPage from './pages/Sentiment';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SentimentPage name="archie" ></SentimentPage>
      </header>
    </div>
  );
}

export default App;
