import Tool from './Tool';

import tileMath from '../tileMath';

export default class PaintRoller extends Tool {

  toolDown(state, row, col) {
    if (!state.toolIsActive) {
      const toolIsActive = true;
      const tile = tileMath.getCurrentPaintTile(state);
      tile.glyph = state.base.get(row).get(col).glyph;
      const base = tileMath.updateGridTile(state.base, row, col, tile);
      const lastToolTile = { row, col };
      return { toolIsActive, lastToolTile, base };
    }
  }

  toolMove(state, row, col) {
    if (state.toolIsActive) {
      const tile = tileMath.getCurrentPaintTile(state);
      tile.glyph = state.base.get(row).get(col).glyph;
      const lastRow = state.lastToolTile.row;
      const lastCol = state.lastToolTile.col;
      const base = tileMath.paintWithInterpolation(state.base, row, col, tile, lastRow, lastCol);
      const lastToolTile = { row, col };
      return { lastToolTile, base };
    }
  }
}
