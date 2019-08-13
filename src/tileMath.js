import immutable from 'immutable';

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

function newPreviewGrid(width, height) {
  return intializeDoubleList(width, height, null);
};

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

function circle(row0, col0, row1, col1) {
  return [];
  //
  // const tiles = [];
  // const radius = Math.sqrt(Math.pow((row1 - row0), 2) + Math.pow((col1 - col0), 2));
  // let x = 0;
  // let y = radius;
  // let d = (5 - radius * 4) / 4;
  //
  // do {
  //   tiles.push({ row: row0 + y, col: col0 + x });
  //   tiles.push({ row: row0 - y, col: col0 + x });
  //   tiles.push({ row: row0 + y, col: col0 - x });
  //   tiles.push({ row: row0 - y, col: col0 - x });
  //   tiles.push({ row: row0 + x, col: col0 + y });
  //   tiles.push({ row: row0 - x, col: col0 + y });
  //   tiles.push({ row: row0 + x, col: col0 - y });
  //   tiles.push({ row: row0 - x, col: col0 - y });
  //   if (d < 0) {
  //     d += 2 * x + 1;
  //   } else {
  //     d += 2 * (x - y) + 1;
  //     y--;
  //   }
  //   x++;
  // } while(x <= y);
  //
  // return tiles;

  const points = [];

  const xAxis = Math.abs(col1 - col0);
  const yAxis = Math.abs(row1 - row0);

  const xBound = Math.round();
  const yBound = Math.round(row1 - row0);
  for (let y = -yBound; y <= yBound; y++) {
    const rowPoints = [];
    for (let x = -xBound; x <= xBound; x++) {
      const row = Math.round(
        (yAxis / xAxis) *
        Math.sqrt(Math.pow(xAxis, 2) - Math.pow(x, 2)));

      // console.log(`${x}, ${y}: row: +/- ${row}`);
      if (y <= row && y >= -row) {
        rowPoints.push({ row: row0 + y, col: col0 + x });
      }
    }

    // Only pick the first and last (if it exists) tile in the row for the ellipse
    if (rowPoints.length > 0) {
      points.push(rowPoints[0]);
    }
    if (rowPoints.length > 1) {
      points.push(rowPoints[rowPoints.length - 1]);
    }
  }
  return points;
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
  newPreviewGrid,
  coalesceGridLayers,
  circle,
  line,
  floodFill,
}
