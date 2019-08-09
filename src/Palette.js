import React, { Component } from 'react';
import styled from 'styled-components';

const SidePanel = styled.div`
  height: 100%;
  width: ${props => props.config.sidePanelWidth}px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #eeeeee;
  overflow-x: hidden;
  padding: 10px;
`;

class Palette extends Component {
  render() {
    return (
      <SidePanel config={this.props.config} >
      palette
      </SidePanel>
    );
  }
}

export default Palette;
