import React from "react";
import styled from "styled-components";
import "./App.css";

const Circle = styled.div`
  background-color: tomato;
  height: 100px;
  width: 100px;
  border-radius: 15%;
`;

function App() {
  return (
    <div className="App">
      <Circle>tomato</Circle>
    </div>
  );
}

export default App;
