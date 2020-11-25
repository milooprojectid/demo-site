import { Menu, Layout } from 'antd';
import React from 'react';
import './App.css';

import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import SentimentPage from './pages/Sentiment';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">

        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/sentiment">Sentiment</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: '25px 25px', height: "calc(100vh - 50px)" }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/sentiment">
                <SentimentPage />
              </Route>
              <Route path="/">
                <h1>Home</h1>
              </Route>
            </Switch>
          </div>
        </Content>

        {/* <Footer style={{ textAlign: 'center' }}>
          Miloo Project 2020
        </Footer> */}
      </Layout>
    </Router>
  );
}

export default App;
