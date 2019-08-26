import Tool from './Tool';

import tileMath from '../tileMath';

export default class Bucket extends Tool {

  toolDown(state, row, col) {
    if (!state.toolIsActive) {
      console.log('bucket fill');
      const toolIsActive = true;
      const tile = tileMath.getCurrentPaintTile(state);
      const points = tileMath.floodFill(row, col, state.base);
      const base = tileMath.updateGridTiles(state.base, points, tile)
      return { toolIsActive, base };
    }
  }
}
