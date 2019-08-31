import Tool from './Tool';

import tileMath from '../tileMath';

export default class EyeDropper extends Tool {

  toolDown(state, row, col) {
    if (!state.toolIsActive) {
      const toolIsActive = true;
      const { base, paletteColorFg, paletteColorBg, paletteGlyph } = state;
      const { colorFg, colorBg, glyph } = base.get(row).get(col);
      const colorsFg = tileMath.updateDoubleListEntry(
        state.colors, paletteColorFg.row, paletteColorFg.col, colorFg);
      const colors = tileMath.updateDoubleListEntry(
        colorsFg, paletteColorBg.row, paletteColorBg.col, colorBg);
      const glyphs = tileMath.updateDoubleListEntry(
        state.glyphs, paletteGlyph.row, paletteGlyph.col, glyph);
      return { toolIsActive, colors, glyphs };
    }
  }
}
