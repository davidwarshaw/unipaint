import Tool from './Tool';

import tileMath from '../tileMath';

export default class Rectangle extends Tool {

  toolMove(state, row, col) {
    if (state.toolIsActive) {
      const tile = tileMath.getCurrentPaintTile(state);
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const line1 = tileMath.line(lastRow, lastCol, lastRow, col);
      const line2 = tileMath.line(lastRow, lastCol, row, lastCol);
      const line3 = tileMath.line(row, lastCol, row, col);
      const line4 = tileMath.line(lastRow, col, row, col);
      const tiles = [].concat(line1, line2, line3, line4);
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
      const line1 = tileMath.line(lastRow, lastCol, lastRow, col);
      const line2 = tileMath.line(lastRow, lastCol, row, lastCol);
      const line3 = tileMath.line(row, lastCol, row, col);
      const line4 = tileMath.line(lastRow, col, row, col);
      const tiles = [].concat(line1, line2, line3, line4);
      const base = tileMath.updateGridTiles(state.base, tiles, tile);
      const preview = tileMath.newPreviewGrid(state.gridWidth, state.gridHeight);
      return { toolIsActive, base, preview };
    }
  }
}
