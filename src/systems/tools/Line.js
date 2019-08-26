import Tool from './Tool';

import tileMath from '../tileMath';

export default class Line extends Tool {

  toolMove(state, row, col) {
    if (state.toolIsActive) {
      const tile = tileMath.getCurrentPaintTile(state);
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const line = tileMath.line(lastRow, lastCol, row, col);
      const newPreview = tileMath.newPreviewGrid(state.gridWidth, state.gridHeight);
      const preview = tileMath.updateGridTiles(newPreview, line, tile);
      return { preview };
    }
  }

  toolUp(state, row, col) {
    if (state.toolIsActive) {
      const toolIsActive = false;
      const tile = tileMath.getCurrentPaintTile(state);
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const line = tileMath.line(lastRow, lastCol, row, col);
      const base = tileMath.updateGridTiles(state.base, line, tile);
      const preview = tileMath.newPreviewGrid(state.gridWidth, state.gridHeight);
      return { toolIsActive, base, preview };
    }
  }
}
