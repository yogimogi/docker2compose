import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./common/Header";
import Error from "./common/Error";
import Flow from "./flow/Flow";
import Page1 from "./page1/Page1";
import Page2 from "./page2/Page2";
import Page3 from "./page3/Page3";

const App = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/" component={Flow} />
        <Route path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route path="/page3" component={Page3} />
        <Route component={Error} />
      </Switch>
    </>
  );
};

export default App;
