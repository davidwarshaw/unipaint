import React, { Component } from 'react';
import styled from 'styled-components';

const GridItem = styled.div`
  grid-row: ${props => props.row + 1};
  grid-column: ${props => props.col + 1};
  color: ${props => props.colorFg};
  background-color: ${props => props.colorBg};
`;

class Tile extends Component {
  render() {
    console.log(this.props.row);
    return (
      <GridItem
        row={this.props.row} col={this.props.col}
        colorFg={this.props.tile.colorFg} colorBg={this.props.tile.colorBg} >
        {this.props.tile.character}
      </GridItem>
    );
  }
}

export default Tile;
