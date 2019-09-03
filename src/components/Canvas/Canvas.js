import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../properties';

import TileGrid from './TileGrid/TileGrid';

const GridContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: ${props => props.canvasWidthPixels}px;
  height: ${props => props.canvasHeightPixels}px;

  background-color: #ffffff;
`;

class Canvas extends PureComponent {
  render() {
    const { grid, gridTilePixels, toolDown, toolMove, toolUp, toolOver } = this.props;

    const tileGridTop = properties.canvasMargin;
    const tileGridLeft = properties.canvasMargin + properties.sidePanelWidth;

    const numGridRows = grid.size;
    const numGridCols = grid.get(0).size;

    const gridWidthPixels = numGridCols * gridTilePixels.width;
    const gridHeightPixels = numGridRows * gridTilePixels.height;

    const canvasWidthPixels = properties.sidePanelWidth +
      properties.canvasMargin + gridWidthPixels + properties.canvasMargin;
    const canvasHeightPixels = properties.canvasMargin + gridHeightPixels + properties.canvasMargin;

    return (
      <GridContainer canvasWidthPixels={canvasWidthPixels} canvasHeightPixels={canvasHeightPixels} >
        <TileGrid
          top={tileGridTop} left={tileGridLeft} grid={grid}
          numGridRows={numGridRows} numGridCols={numGridCols} gridTilePixels={gridTilePixels}
          toolDown={toolDown} toolMove={toolMove} toolUp={toolUp} toolOver={toolOver} />
      </GridContainer>
    );
  }
}

export default Canvas;
