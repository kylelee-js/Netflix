import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path={"/"}>
          <Home />
        </Route>
        <Route exact path={"/tv"}>
          <TV />
        </Route>
        <Route exact path={"/search"}>
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
