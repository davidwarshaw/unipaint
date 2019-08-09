import React, { Component } from 'react';

import Canvas from './Canvas';
import Palette from './Palette';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.config = {
      sidePanelWidth: 200
    };
    this.state = {
      gridX: 0,
      gridY: 0,
      gridWidth: 40,
      gridHeight: 20,
      scale: 0,
      fontSize: 16,
      fontFamily: "monospace",
      fontStyle: "",
      colorFg: '#001122',
      colorBg: '#334455',
      grid: [
        [{ colorFg: '#001122', coloBg: '#334455', character: 'x' },
          { colorFg: '#001122', coloBg: '#334455', character: 'x' }],
        [{ colorFg: '#001122', coloBg: '#334455', character: 'x' },
          { colorFg: '#001122', coloBg: '#334455', character: 'x' }],
      ]
    }
  }

  render() {
    return (
      <div className="App">
        <Palette config={this.config}/>
        <Canvas config={this.config} grid={this.state.grid} />
      </div>
    );
  }
}

export default App;
