import immutable from 'immutable';

import properties from '../properties';

import tileMath from './tileMath';

import standardColorPalette from '../data/standardColorPalette.json';

function createInitialState() {

  const defaultPaletteSize = 16;

  const defaultGridWidth = 44;
  const defaultGridHeight = 36;

  const state = {
    // TileGrid
    gridX: 10,
    gridY: 10,
    gridWidth: defaultGridWidth,
    gridHeight: defaultGridHeight,
    resetGridWidth: defaultGridWidth,
    resetGridHeight: defaultGridHeight,
    gridTilePixels: { width: 12, height: 16 },
    gridScale: 1,
    fontStyle: "",
    base: initializeGrid(defaultGridWidth, defaultGridHeight, properties.defaultTile),
    preview: tileMath.newPreviewGrid(defaultGridWidth, defaultGridHeight),

    // ColorPalette
    colors: initializeColors(defaultPaletteSize),
    paletteColorFg: { row: 0, col: 0 },
    paletteColorBg: { row: 0, col: 15 },

    // PaletteInfo
    fgColorSelected: true,

    // GlyphPalette
    glyphs: initializeGlyphs(defaultPaletteSize),
    paletteGlyph: { row: 0, col: 0 },

    // ToolsPalette
    selectedTool: 'pencil',
    toolIsActive: false,
    lastToolTile: { row: null, col: null },
  }

  return state;
}

function initializeColors(size) {
  const colorRows = [...Array(size).keys()]
    .map((row) => {
      const colorRow = [...Array(size).keys()]
        .map((col) => standardColorPalette[(row * size) + col].hexString);
      return immutable.List(colorRow);
    });
  return immutable.List(colorRows);
}

function initializeGlyphs(size) {
  const ascii = tileMath.range(0x0020, 0x007E);
  const boxDrawing = tileMath.range(0x2500, 0x257F);
  const latinExtendedB = tileMath.range(0x0180, 0x240F);
  const codePoints = [].concat(ascii, boxDrawing, latinExtendedB);

  const glyphRows = [...Array(size).keys()]
    .map((row) => {
      const glyphRow = [...Array(size).keys()]
        .map((col) => String.fromCodePoint(codePoints[(row * size) + col]))
      return immutable.List(glyphRow);
    });
  return immutable.List(glyphRows);
}

function initializeGrid(width, height, defaultTile) {
  return tileMath.intializeDoubleList(width, height, defaultTile);
}

export default { createInitialState };
