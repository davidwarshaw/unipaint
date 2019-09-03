import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../../properties';

import TileRow from './TileRow';

const Grid = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;

  display: grid;
  grid-template-rows: repeat(${props => props.numGridRows}, ${props => props.gridTileHeight});
  grid-gap: 0;
  justify-items: center;
  align-items: center;

  font-family: ${props => props.styles.tileFontFamily};
  font-weight: ${props => props.styles.tileFontWeight};
  font-size: ${props => props.styles.tileFontSize};

  margin: 0;
  padding: 0;

  cursor: default;
  user-select: none;

  border: 0 solid black;
`;

class TileGrid extends PureComponent {
  render() {
    const styles = {
      tileFontFamily: properties.tileFontFamily,
      tileFontWeight: properties.tileFontWeight,
      tileFontSize: properties.tileFontSize,
    };
    const {
      top, left, grid, numGridRows, numGridCols, gridTilePixels,
      toolDown, toolMove, toolUp, toolOver
    } = this.props;

    const gridTileHeight = `${gridTilePixels.height}px`;

    return (
      <Grid id={properties.gridElementId} styles={styles} top={top} left={left}
        gridTileHeight={gridTileHeight} numGridRows={numGridRows} >
        {grid.map((tileRow, row) =>
            <TileRow key={row} tileRow={tileRow} row={row} gridTilePixels={gridTilePixels} numGridCols={numGridCols}
              toolDown={toolDown} toolMove={toolMove} toolUp={toolUp} toolOver={toolOver} />)}
      </Grid>
    );
  }
}

export default TileGrid;
