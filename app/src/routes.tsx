import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import LoginPage from './pages/login'
import ThreadsPage from './pages/threads'
import ThreadPage from './pages/thread'
import PrivateRoute from "./components/PrivateRoute";
import VotingPage from "./pages/voting";
import PageHeader from "./components/PageHeader";

const Routes: React.FC = () => (
    <div>
        <PageHeader/>
        <Switch>
            <PrivateRoute exact path="/" component={ThreadsPage} />
            <PrivateRoute path="/thread/:id" component={ThreadPage} />
            <PrivateRoute path="/vote" component={VotingPage} />
            <Route path="/login" component={LoginPage} />
            <Route component={() => <div>Not Found</div>} />
        </Switch>
    </div>
)

export default Routes