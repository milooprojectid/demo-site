import { Menu, Layout, Typography } from 'antd';
import React from 'react';
import './App.css';

import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import SentimentPage from './pages/Sentiment';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  return (
    <Router>
      <Layout className="layout" style={{ height:"100vh" }}>

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

        <Content style={{ padding: '25px 25px' }}>
            <Switch>
              <Route path="/sentiment">
                <SentimentPage />
              </Route>
              <Route path="/">
                <h1>Home</h1>
              </Route>
            </Switch>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          <Text type="secondary">Miloo Project 2020</Text>
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
