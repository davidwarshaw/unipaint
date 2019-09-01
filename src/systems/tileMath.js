import immutable from 'immutable';

import properties from '../properties';

function tileKey(row, col) {
  return `${row}-${col}`;
}

function tileExists(row, col, grid) {
  return (row >= 0 && row < grid.size) && (col >= 0 && col < grid.get(row).size);
}

function tilesAreEqual(tile1, tile2) {
  return tile1.colorFg === tile2.colorFg && tile1.colorBg === tile2.colorBg &&
    tile1.glyph === tile2.glyph;
}

function range(start, end) {
  return Array.from({length: (end - start)}, (v, k) => k + start);
}

function immutablizeDoubleArray(doubleArray) {
  return immutable.List(doubleArray.map(row => immutable.List(row)));
}

function intializeDoubleList(width, height, value) {
  const listRows = [...Array(height).keys()]
    .map(() => {
      const gridRow = [...Array(width).keys()]
        .map(() => value);
      return immutable.List(gridRow);
    });
  return immutable.List(listRows);
}

function changeDoubleListSize(rows, newWidth, newHeight) {
  const listRows = [...Array(newHeight).keys()]
    .map((row) => {
      const gridRow = [...Array(newWidth).keys()]
        .map((col) => {
          if (rows.get(row) && rows.get(row).get(col)) {
            return rows.get(row).get(col);
          }
          return properties.defaultTile;
        });
      return immutable.List(gridRow);
    });
  return immutable.List(listRows);
}

function updateDoubleListEntry(rows, row, col, value) {
  const rowEntry = rows.get(row);
  const newRowEntry = rowEntry.set(col, value);
  return rows.set(row, newRowEntry);
}

function newPreviewGrid(width, height) {
  return intializeDoubleList(width, height, null);
}

function getCurrentPaintTile(state) {
  const { colors, paletteColorFg, paletteColorBg, glyphs, paletteGlyph } = state;
  const colorFg = colors.get(paletteColorFg.row).get(paletteColorFg.col);
  const colorBg = colors.get(paletteColorBg.row).get(paletteColorBg.col);
  const glyph = glyphs.get(paletteGlyph.row).get(paletteGlyph.col);
  return { glyph, colorFg, colorBg };
}

function updateGridTile(base, row, col, tile) {
  return this.updateDoubleListEntry(base, row, col, tile);
}

function updateGridTiles(base, points, tile) {
  let nextGrid = base;
  for (const point of points) {
    const rowList = nextGrid.get(point.row);
    const newRowList = rowList.set(point.col, tile);
    nextGrid = nextGrid.set(point.row, newRowList);
  }
  return nextGrid;
}

function paintWithInterpolation(base, row, col, tile, lastRow, lastCol) {
  const interpolation = line(lastRow, lastCol, row, col);
  if (interpolation.length > 2) {
    return this.updateGridTiles(base, interpolation, tile);
  } else {
    return this.updateGridTile(base, row, col, tile);
  }
}

function coalesceGridLayers(width, height, layers) {
  const listRows = [...Array(height).keys()]
    .map((row) => {
      const gridRow = [...Array(width).keys()]
        .map((col) => layers
          .map(layer => layer.get(row).get(col))
          .find(value => value));
      return immutable.List(gridRow);
    });
  return immutable.List(listRows);
}

function line(row0, col0, row1, col1) {

  const tiles = [];

  let dx = Math.abs(col1 - col0);
  let dy = Math.abs(row1 - row0);
  let sx = (col0 < col1) ? 1 : -1;
  let sy = (row0 < row1) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    tiles.push({ row: row0, col: col0 });

    if ((col0 === col1) && (row0 === row1)) break;
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; col0  += sx; }
    if (e2 < dx) { err += dx; row0  += sy; }
  }

  return tiles;
}

function ellipse(lastRow, lastCol, row, col) {

  const tiles = [];

  const xc = (col + lastCol) / 2;
  const yc = (row + lastRow) / 2;
  const rx = Math.abs(col - lastCol) / 2;
  const ry = Math.abs(row - lastRow) / 2;

	let x = 0;
	let y = ry;

	// Initial decision parameter of region 1
	let d1 = (ry * ry) - (rx * rx * ry) +
					(0.25 * rx * rx);
	let dx = 2 * ry * ry * x;
	let dy = 2 * rx * rx * y;

	// For region 1
	while (dx < dy)
	{

    tiles.push({ row: y + yc, col: x + xc });
    tiles.push({ row: y + yc, col: -x + xc });
    tiles.push({ row: -y + yc, col: x + xc });
    tiles.push({ row: -y + yc, col: -x + xc });

		// Checking and updating value of
		// decision parameter based on algorithm
		if (d1 < 0)
		{
			x++;
			dx = dx + (2 * ry * ry);
			d1 = d1 + dx + (ry * ry);
		}
		else
		{
			x++;
			y--;
			dx = dx + (2 * ry * ry);
			dy = dy - (2 * rx * rx);
			d1 = d1 + dx - dy + (ry * ry);
		}
	}

	// Decision parameter of region 2
	let d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5)))
		+ ((rx * rx) * ((y - 1) * (y - 1)))
		- (rx * rx * ry * ry);

	// Plotting tiles of region 2
	while (y >= 0) {

    tiles.push({ row: y + yc, col: x + xc });
    tiles.push({ row: y + yc, col: -x + xc });
    tiles.push({ row: -y + yc, col: x + xc });
    tiles.push({ row: -y + yc, col: -x + xc });

		// Checking and updating parameter
		// value based on algorithm
		if (d2 > 0) {
			y--;
			dy = dy - (2 * rx * rx);
			d2 = d2 + (rx * rx) - dy;
		}
		else {
			y--;
			x++;
			dx = dx + (2 * ry * ry);
			dy = dy - (2 * rx * rx);
			d2 = d2 + dx - dy + (rx * rx);
		}
	}

  return tiles;
}

function floodFill(row0, col0, grid) {
  // Grid is an Immutable List of Immutable Lists
  const target = grid.get(row0).get(col0);
  const tiles = [];
  const checked = {};
  const fillNeighbors = (row, col) => {
    checked[`${row}-${col}`] = true;
    // If this tile isnt the target type, then dont do anything
    if (!tileExists(row, col, grid) || !tilesAreEqual(grid.get(row).get(col), target)) {
      return;
    }

    // Add this tile to the list
    tiles.push({ row, col });

    // Try the neighbors
    if (!checked[`${row - 1}-${col}`]) { fillNeighbors(row - 1, col); }
    if (!checked[`${row + 1}-${col}`]) { fillNeighbors(row + 1, col); }
    if (!checked[`${row}-${col - 1}`]) { fillNeighbors(row, col - 1); }
    if (!checked[`${row}-${col + 1}`]) { fillNeighbors(row, col + 1); }
  };

  fillNeighbors(row0, col0);

  return tiles;
}

export default {
  tileKey,
  range,
  immutablizeDoubleArray,
  intializeDoubleList,
  changeDoubleListSize,
  updateDoubleListEntry,
  newPreviewGrid,
  getCurrentPaintTile,
  updateGridTile,
  updateGridTiles,
  paintWithInterpolation,
  coalesceGridLayers,
  ellipse,
  line,
  floodFill,
}
