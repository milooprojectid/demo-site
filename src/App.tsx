import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import SentimentPage from './pages/Sentiment';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/sentiment">
          <SentimentPage name="archie" />
        </Route>
        <Route path="/">
          <h1>Home</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
