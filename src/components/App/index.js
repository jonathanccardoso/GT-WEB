import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import Subject from "../../pages/Subject";
import SubjectDetail from "../../pages/SubjectDetail";
import MilestoneDetail from "../../pages/MilestoneDetail";
import Page404 from "../../pages/Page404";

import AuthProvider from "../../contents/auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route exact path="/" component={Subject} />
          <Route path="/subject/:id" component={SubjectDetail} />
          <Route path="/milestone/:id" component={MilestoneDetail} />

          <Route path="*" component={Page404} status={404} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
