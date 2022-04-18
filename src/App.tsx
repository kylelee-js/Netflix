import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";
import Header from "./Components/Header";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <>
          <Route path={["/tv", "/tv/*"]}>
            <TV />
          </Route>
          <Route path={["/search", "/search/*"]}>
            <Search />
          </Route>
          <Route exact path={["/", "/movies/*"]}>
            <Home />
          </Route>
        </>
      </Switch>
    </Router>
  );
}

export default App;
