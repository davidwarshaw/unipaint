import React, { Component } from 'react';
import styled from 'styled-components';

import Tile from './Tile';

const Grid = styled.div`
  display: grid;
  grid-gap: 0;
  grid-template-columns: ${props => props.grid ? props.grid[0].map(tile => 'auto ') : 'auto'};
`;

class TileGrid extends Component {
  render() {
    return (
      <Grid>
        {this.props.grid.map((tiles, row) =>
          tiles.map((tile, col) =>
            <Tile row={row} col={col} tile={tile} key={`${row}-${col}`} />))}
      </Grid>
    );
  }
}

export default TileGrid;
