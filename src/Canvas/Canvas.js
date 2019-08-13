import React, { PureComponent } from 'react';

import properties from '../properties';

import TileGrid from './TileGrid/TileGrid';

class Canvas extends PureComponent {
  render() {
    const { gridX, gridY, grid, gridTilePixels, toolDown, toolMove, toolUp, toolOver } = this.props;
    const tileGridLeft = gridX + properties.sidePanelWidth;
    return (
        <TileGrid
          top={gridY} left={tileGridLeft} grid={grid} gridTilePixels={gridTilePixels}
          toolDown={toolDown} toolMove={toolMove} toolUp={toolUp} toolOver={toolOver} />
    );
  }
}

export default Canvas;
