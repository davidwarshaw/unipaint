import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import FileSaver from 'file-saver';
import htmlToImage from 'html-to-image';

import properties from './properties';

import initialState from './initialState';
import tileMath from './tileMath'

import Canvas from './Canvas/Canvas';
import SidePanel from './SidePanel/SidePanel';

const StyledToolTip = styled(ReactTooltip)`
  font-family: ${props => props.styles.fontFamily};
  font-weight: bold;
  font-size: medium;
`;

const Container = styled.div`
  background-color: ${props => props.styles.canvasBgColor};
`;

class App extends PureComponent {
  constructor(props) {
    super(props);

    // Load from local storage if data has been saved, otherwise recreate
    const stringState = localStorage.getItem(properties.localStorageKey);
    if (stringState) {
      this.state = JSON.parse(stringState);
      // Double lists are serialized as double arrays, so must be converted back
      this.state.colors = tileMath.immutablizeDoubleArray(this.state.colors);
      this.state.glyphs = tileMath.immutablizeDoubleArray(this.state.glyphs);
      this.state.base = tileMath.immutablizeDoubleArray(this.state.base);
      this.state.preview = tileMath.immutablizeDoubleArray(this.state.preview);
    } else {
      this.state = initialState.createInitialState();
    }
  }

  updateDimensions = () => {
    const { gridWidth, gridHeight, gridTilePixels } = this.state;
    const pixelWidth = gridWidth * gridTilePixels.width;
    const pixelHeight = gridHeight * gridTilePixels.height;
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    console.log(`canvasWidth: ${canvasWidth} canvasHeight: ${canvasHeight}`);
    console.log(`pixelWidth: ${pixelWidth} pixelHeight: ${pixelHeight}`);
    const gridX = 20;// + Math.round((canvasWidth / 2) - (pixelWidth / 2)) + properties.sidePanelWidth;
    const gridY = 20;// + Math.round((canvasHeight / 2) - (pixelHeight / 2));
    this.setState({ gridX, gridY });
  }

  saveToLocalStorage = () => {
    const stateString = JSON.stringify(this.state);
    localStorage.setItem(properties.localStorageKey, stateString);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('beforeunload', this.saveToLocalStorage);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('beforeunload', this.saveToLocalStorage);
  }

  getCurrentPaintTile() {
    const { colors, paletteColorFg, paletteColorBg, glyphs, paletteGlyph } = this.state;
    const colorFg = colors.get(paletteColorFg.row).get(paletteColorFg.col);
    const colorBg = colors.get(paletteColorBg.row).get(paletteColorBg.col);
    const glyph = glyphs.get(paletteGlyph.row).get(paletteGlyph.col);
    return { glyph, colorFg, colorBg };
  }

  updateDoubleListEntry(rows, row, col, value) {
    const rowEntry = rows.get(row);
    const newRowEntry = rowEntry.set(col, value);
    return rows.set(row, newRowEntry);
  }

  updateGridTile(base, row, col, tile) {
    return this.updateDoubleListEntry(base, row, col, tile);
  }

  updateGridTiles(base, points, tile) {
    let nextGrid = base;
    for (const point of points) {
      const rowList = nextGrid.get(point.row);
      const newRowList = rowList.set(point.col, tile);
      nextGrid = nextGrid.set(point.row, newRowList);
    }
    return nextGrid;
  }

  paintWithInterpolation(base, row, col, tile) {
    const lastRow = this.state.lastToolTile.row;
    const lastCol = this.state.lastToolTile.col;
    const interpolation = tileMath.line(lastRow, lastCol, row, col);
    if (interpolation.length > 2) {
      return this.updateGridTiles(this.state.base, interpolation, tile);
    } else {
      return this.updateGridTile(this.state.base, row, col, tile);
    }
  }

  setColorFgSelected = (fgColorSelected) => {
    console.log(`fgColorSelected: ${fgColorSelected}`);
    this.setState({ fgColorSelected });
  }

  setColor = (row, col) => {
    console.log(`setColor: row: ${row} col: ${col}`);
    if (this.state.fgColorSelected) {
      const paletteColorFg = { row, col };
      this.setState({ paletteColorFg });
    } else {
      const paletteColorBg = { row, col };
      this.setState({ paletteColorBg });
    }
  }

  setColorValue = (event, setFg) => {
    const color = event.target.value;
    console.log(`setColorValue: color: ${color} setFg: ${setFg}`);
    const { paletteColorFg, paletteColorBg } = this.state;
    const selectedPaletteColor = setFg ? paletteColorFg : paletteColorBg;
    console.log(selectedPaletteColor);
    const { row, col } = selectedPaletteColor;
    console.log(`setColorValue: row: ${row} col: ${col}`);
    const colors = this.updateDoubleListEntry(this.state.colors, row, col, color);
    this.setState({ colors });
  }

  setGlyph = (row, col) => {
    console.log(`setGlyph: row: ${row} col: ${col}`);
    const paletteGlyph = { row, col };
    this.setState({ paletteGlyph });
  }

  setGlyphValue = (event) => {
    // Only keep the last four digits entered, uppercase them, and cleanse out non hex chars
    const input = event.target.value;
    let char;
    if (input.length === 1) {
      char = input;
      console.log(`setGlyphValue: char: ${char}`);
    } else {
      const charCode = input.slice(-4).toUpperCase().replace(/[^0-9A-F]/, '');
      char = String.fromCharCode(`0x${charCode}`);
      console.log(`setGlyphValue: charCode: ${charCode} char: ${char}`);
    }
    const { row, col } = this.state.paletteGlyph;
    console.log(`setGlyphValue: row: ${row} col: ${col}`);
    const glyphs = this.updateDoubleListEntry(this.state.glyphs, row, col, char);
    this.setState({ glyphs });
  }

  setSelectedTool = (selectedTool) => {
    console.log(`selectedTool: ${selectedTool}`);
    this.setState({ selectedTool });
  }

  toolDown = (row, col) => {
    switch (this.state.selectedTool) {
      case 'pencil': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const tile = this.getCurrentPaintTile();
          const base = this.updateGridTile(this.state.base, row, col, tile)
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile, base });
        }
        break;
      }
      case 'bucket': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const tile = this.getCurrentPaintTile();
          const points = tileMath.floodFill(row, col, this.state.base);
          const base = this.updateGridTiles(this.state.base, points, tile)
          this.setState({ toolIsActive, base });
        }
        break;
      }
      case 'eye-dropper': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const { base, paletteColorFg, paletteColorBg, paletteGlyph } = this.state;
          const { colorFg, colorBg, glyph } = base.get(row).get(col);
          const colorsFg = this.updateDoubleListEntry(
            this.state.colors, paletteColorFg.row, paletteColorFg.col, colorFg);
          const colors = this.updateDoubleListEntry(
            colorsFg, paletteColorBg.row, paletteColorBg.col, colorBg);
          const glyphs = this.updateDoubleListEntry(
            this.state.glyphs, paletteGlyph.row, paletteGlyph.col, glyph);
          this.setState({ toolIsActive, colors, glyphs });
        }
        break;
      }
      case 'line': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile });
        }
        break;
      }
      case 'rectangle': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile });
        }
        break;
      }
      case 'circle': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile });
        }
        break;
      }
      case 'paint-roller': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const tile = this.getCurrentPaintTile();
          tile.glyph = this.state.base.get(row).get(col).glyph;
          const base = this.updateGridTile(this.state.base, row, col, tile);
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile, base });
        }
        break;
      }
      case 'type': {
        if (!this.state.toolIsActive) {
          const toolIsActive = true;
          const tile = this.getCurrentPaintTile();
          tile.colorFg = this.state.base.get(row).get(col).colorFg;
          tile.colorBg = this.state.base.get(row).get(col).colorBg;
          const base = this.updateGridTile(this.state.base, row, col, tile);
          const lastToolTile = { row, col };
          this.setState({ toolIsActive, lastToolTile, base });
        }
        break;
      }
      default:
    }
  }

  toolMove = (row, col) => {
    switch (this.state.selectedTool) {
      case 'pencil': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();

          const base = this.paintWithInterpolation(this.state.base, row, col, tile);
          const lastToolTile = { row, col };
          this.setState({ lastToolTile, base });
        }
        break;
      }
      case 'line': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const line = tileMath.line(lastRow, lastCol, row, col);
          const newPreview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          const preview = this.updateGridTiles(newPreview, line, tile);
          this.setState({ preview });
        }
        break;
      }
      case 'rectangle': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const line1 = tileMath.line(lastRow, lastCol, lastRow, col);
          const line2 = tileMath.line(lastRow, lastCol, row, lastCol);
          const line3 = tileMath.line(row, lastCol, row, col);
          const line4 = tileMath.line(lastRow, col, row, col);
          const points = [].concat(line1, line2, line3, line4);
          const newPreview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          const preview = this.updateGridTiles(newPreview, points, tile);
          this.setState({ preview });
        }
        break;
      }
      case 'circle': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const circle = tileMath.circle(lastRow, lastCol, row, col);
          const newPreview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          const preview = this.updateGridTiles(newPreview, circle, tile);
          this.setState({ preview });
        }
        break;
      }
      case 'paint-roller': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();
          tile.glyph = this.state.base.get(row).get(col).glyph;

          const base = this.paintWithInterpolation(this.state.base, row, col, tile);
          const lastToolTile = { row, col };
          this.setState({ lastToolTile, base });
        }
        break;
      }
      case 'type': {
        if (this.state.toolIsActive) {
          const tile = this.getCurrentPaintTile();
          tile.colorFg = this.state.base.get(row).get(col).colorFg;
          tile.colorBg = this.state.base.get(row).get(col).colorBg;

          const base = this.paintWithInterpolation(this.state.base, row, col, tile);
          const lastToolTile = { row, col };
          this.setState({ lastToolTile, base });
        }
        break;
      }
      default:
    }
  }

  toolUp = (row, col) => {
    switch (this.state.selectedTool) {
      case 'pencil': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          this.setState({ toolIsActive });
        }
        break;
      }
      case 'bucket': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          this.setState({ toolIsActive });
        }
        break;
      }
      case 'eye-dropper': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          this.setState({ toolIsActive });
        }
        break;
      }
      case 'line': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const line = tileMath.line(lastRow, lastCol, row, col);
          const base = this.updateGridTiles(this.state.base, line, tile);
          const preview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          this.setState({ toolIsActive, base, preview });
        }
        break;
      }
      case 'rectangle': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const line1 = tileMath.line(lastRow, lastCol, lastRow, col);
          const line2 = tileMath.line(lastRow, lastCol, row, lastCol);
          const line3 = tileMath.line(row, lastCol, row, col);
          const line4 = tileMath.line(lastRow, col, row, col);
          const points = [].concat(line1, line2, line3, line4);
          const base = this.updateGridTiles(this.state.base, points, tile);
          const preview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          this.setState({ toolIsActive, base, preview });
        }
        break;
      }
      case 'circle': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          const tile = this.getCurrentPaintTile();
          const lastRow = this.state.lastToolTile.row;
          const lastCol = this.state.lastToolTile.col;
          const circle = tileMath.circle(lastRow, lastCol, row, col);
          const base = this.updateGridTiles(this.state.base, circle, tile);
          const preview = tileMath.newPreviewGrid(this.state.gridWidth, this.state.gridHeight);
          this.setState({ toolIsActive, base, preview });
        }
        break;
      }
      case 'paint-roller': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          this.setState({ toolIsActive });
        }
        break;
      }
      case 'type': {
        if (this.state.toolIsActive) {
          const toolIsActive = false;
          this.setState({ toolIsActive });
        }
        break;
      }
      default:
    }
  }

  toolOver = (row, col) => {
    switch (this.state.selectedTool) {
      case 'pencil': {
        break;
      }
      default:
    }
  }

  newFile = () => {
    const newState = initialState.createInitialState();
    this.setState(newState);
  }

  loadJsonFile = (e) => {
    const file = e.target.files[0]
    console.log('Loading');
    console.log(file);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = JSON.parse(fileReader.result);
      const base = tileMath.immutablizeDoubleArray(content);
      this.setState({ base });
    }
    fileReader.readAsText(file);
  }

  saveJsonFile = () => {
    console.log(`Saving to: ${properties.defaultSaveJsonFilename}`);
    const stringBase = JSON.stringify(this.state.base);
    const blob = new Blob([stringBase], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, properties.defaultSaveJsonFilename);
  }

  savePngFile = () => {
    // htmlToImage.toPng(document.getElementById(properties.gridElementId))
    //   .then(dataUrl => FileSaver.saveAs(dataUrl, properties.defaultSavePngFilename));
  }

  render() {
    const styles = {
      fontFamily: properties.labelFontFamily,
      canvasBgColor: properties.canvasBgColor,
    };

    // Get derived props from helper function
    const { glyph, colorFg, colorBg } = this.getCurrentPaintTile();

    // Build the grid by coallescing layers
    const { gridWidth, gridHeight, preview, base } = this.state;
    const grid = tileMath.coalesceGridLayers(gridWidth, gridHeight, [preview, base]);

    return (
      <Container styles={styles} >
        <StyledToolTip delayShow="750" place="top" type="light" effect="float" styles={styles} />
        <SidePanel
          colors={this.state.colors} glyphs={this.state.glyphs}
          colorFg={colorFg} colorBg={colorBg} glyph={glyph}
          paletteColorFg={this.state.paletteColorFg} paletteColorBg={this.state.paletteColorBg}
          fgColorSelected={this.state.fgColorSelected} paletteGlyph={this.state.paletteGlyph}
          selectedTool={this.state.selectedTool}
          setColor={this.setColor} setColorFgSelected={this.setColorFgSelected}
          setGlyph={this.setGlyph} setColorValue={this.setColorValue} setGlyphValue={this.setGlyphValue}
          setSelectedTool={this.setSelectedTool}
          newFile={this.newFile} loadJsonFile={this.loadJsonFile} saveJsonFile={this.saveJsonFile}
          savePngFile={this.savePngFile}
        />
        <Canvas
          gridX={this.state.gridX} gridY={this.state.gridY} grid={grid}
          gridTilePixels={this.state.gridTilePixels}
          toolDown={this.toolDown} toolMove={this.toolMove} toolUp={this.toolUp}
          toolOver={this.toolOver} />
      </Container>
    );
  }
}

export default App;
