import React, { Component } from 'react';
import styled from 'styled-components';

import Tile from './Tile';

const GridRow = styled.div.attrs((props) => ({
    style: {
      // grid-column is one based, not zero based
      gridRow: props.gridRow + 1,
    },
  }))`
  display: grid;
  grid-template-columns: repeat(${props => props.numGridCols}, ${props => props.gridTileWidth});
  grid-gap: 0;
  justify-items: center;
  align-items: center;

  margin: 0;
  padding: 0;
`;
class TileRow extends Component {

  // Nested immutable lists will always return true for re-render, so manually check row hashes
  shouldComponentUpdate(nextProps, nextState) {
     //return hash(this.props) !== hash(nextProps);
     return true;
  }

  render() {
    const { tileRow, row, numGridCols, gridTilePixels, toolDown, toolMove, toolUp, toolOver } = this.props;

    const gridTileWidth = `${gridTilePixels.width}px`;

    return (
      <GridRow gridRow={row} numGridCols={numGridCols} gridTileWidth={gridTileWidth} >
        {tileRow.map((tile, col) =>
          <Tile key={`${row}-${col}`} row={row} col={col} gridTilePixels={gridTilePixels} tile={tile}
            toolDown={toolDown} toolMove={toolMove} toolUp={toolUp} toolOver={toolOver} />)}
      </GridRow>
    );
  }
}

export default TileRow;
