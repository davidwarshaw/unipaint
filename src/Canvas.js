import React, { Component } from 'react';
import styled from 'styled-components';

import TileGrid from './TileGrid';

const MainPanel = styled.div`
  margin-left: ${props => props.config.sidePanelWidth}px;
  padding: 10px;
`;

class Canvas extends Component {
  render() {
    return (
      <MainPanel config={this.props.config} >
        <TileGrid grid={this.props.grid} />
      </MainPanel>
    );
  }
}

export default Canvas;
