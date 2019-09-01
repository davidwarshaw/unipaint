import Tool from './Tool';

import tileMath from '../tileMath';

export default class Rectangle extends Tool {

  toolMove(state, row, col) {
    if (state.toolIsActive) {
      const tile = tileMath.getCurrentPaintTile(state);
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const tiles = tileMath.ellipse(lastRow, lastCol, row, col);
      const newPreview = tileMath.newPreviewGrid(state.gridWidth, state.gridHeight);
      const preview = tileMath.updateGridTiles(newPreview, tiles, tile);
      return { preview };
    }
  }

  toolUp(state, row, col) {
    if (state.toolIsActive) {
      const toolIsActive = false;
      const tile = tileMath.getCurrentPaintTile(state);
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const tiles = tileMath.ellipse(lastRow, lastCol, row, col);
      const base = tileMath.updateGridTiles(state.base, tiles, tile);
      const preview = tileMath.newPreviewGrid(state.gridWidth, state.gridHeight);
      return { toolIsActive, base, preview };
    }
  }
}
