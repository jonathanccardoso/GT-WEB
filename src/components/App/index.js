import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "../../pages/Home";
import SignIn from "../../pages/SignIn";
import Dashboard from "../../pages/Dashboard";
import Subject from "../../pages/Subject";

import AuthProvider from "../../contents/auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/subject" component={Subject} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
