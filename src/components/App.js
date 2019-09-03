import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import FileSaver from 'file-saver';

import properties from '../properties';

import ToolDispatch from '../systems/ToolDispatch';

import initialState from '../systems/initialState';
import tileMath from '../systems/tileMath'

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

    this.toolDispatch = new ToolDispatch();

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

  saveToLocalStorage = () => {
    const stateString = JSON.stringify(this.state);
    localStorage.setItem(properties.localStorageKey, stateString);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.saveToLocalStorage);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveToLocalStorage);
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
    const updates = this.toolDispatch.toolDown(this.state, row, col);
    this.setState(updates);
  }

  toolMove = (row, col) => {
    const updates = this.toolDispatch.toolMove(this.state, row, col);
    this.setState(updates);
  }

  toolUp = (row, col) => {
    const updates = this.toolDispatch.toolUp(this.state, row, col);
    this.setState(updates);
  }

  toolOver = (row, col) => {
    const updates = this.toolDispatch.toolOver(this.state, row, col);
    this.setState(updates);
  }

  resize = () => {
    const { resetGridWidth, resetGridHeight } = this.state;
    console.log(`resize: resetGridWidth: ${resetGridWidth} resetGridHeight: ${resetGridHeight}`);
    const gridWidth = resetGridWidth;
    const gridHeight = resetGridHeight;
    const base = tileMath.changeDoubleListSize(this.state.base, gridWidth, gridHeight);
    const preview = tileMath.newPreviewGrid(gridWidth, gridHeight);
    this.setState({ gridWidth, gridHeight, base, preview });
  }

  resizeReset = () => {
    const { gridWidth, gridHeight } = this.state;
    const resetGridWidth = gridWidth;
    const resetGridHeight = gridHeight;
    console.log(`resizeReset: resetGridWidth: ${resetGridWidth} resetGridHeight: ${resetGridHeight}`);
    this.setState({ resetGridWidth, resetGridHeight });
  }

  setResizeWidth = (event) => {
    const resetGridWidth = parseInt(event.target.value) || '';
    console.log(`resetGridWidth: ${resetGridWidth}`);
    this.setState({ resetGridWidth });
  }

  setResizeHeight = (event) => {
    const resetGridHeight = parseInt(event.target.value) || '';
    console.log(`resetGridHeight: ${resetGridHeight}`);
    this.setState({ resetGridHeight });
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
      const gridWidth = base.get(0).size;
      const gridHeight = base.size;
      const preview = tileMath.newPreviewGrid(gridWidth, gridHeight);
      const resetGridWidth = gridWidth;
      const resetGridHeight = gridHeight;
      this.setState({ base, preview, gridWidth, gridHeight, resetGridWidth, resetGridHeight });
    }
    fileReader.readAsText(file);
  }

  saveJsonFile = () => {
    console.log(`Saving to: ${properties.defaultSaveJsonFilename}`);
    const stringBase = JSON.stringify(this.state.base);
    const blob = new Blob([stringBase], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, properties.defaultSaveJsonFilename);
  }

  render() {
    const styles = {
      fontFamily: properties.labelFontFamily,
      canvasBgColor: properties.canvasBgColor,
    };

    // Get derived props from helper function
    const { glyph, colorFg, colorBg } = tileMath.getCurrentPaintTile(this.state);

    // Build the grid by coallescing layers
    const { gridWidth, gridHeight, preview, base } = this.state;
    const grid = tileMath.coalesceGridLayers(gridWidth, gridHeight, [preview, base]);

    return (
      <Container styles={styles} >
        <StyledToolTip delayShow={750} place="top" type="light" effect="float" styles={styles} />
        <SidePanel
          colors={this.state.colors} glyphs={this.state.glyphs}
          colorFg={colorFg} colorBg={colorBg} glyph={glyph}
          paletteColorFg={this.state.paletteColorFg} paletteColorBg={this.state.paletteColorBg}
          fgColorSelected={this.state.fgColorSelected} paletteGlyph={this.state.paletteGlyph}
          selectedTool={this.state.selectedTool}
          setColor={this.setColor} setColorFgSelected={this.setColorFgSelected}
          setGlyph={this.setGlyph} setColorValue={this.setColorValue} setGlyphValue={this.setGlyphValue}
          setSelectedTool={this.setSelectedTool}
          resize={this.resize} resizeReset={this.resizeReset}
          setResizeWidth={this.setResizeWidth} setResizeHeight={this.setResizeHeight}
          resetGridWidth={this.state.resetGridWidth} resetGridHeight={this.state.resetGridHeight}
          newFile={this.newFile} loadJsonFile={this.loadJsonFile} saveJsonFile={this.saveJsonFile}
          savePngFile={this.savePngFile} />
        <Canvas
          grid={grid} gridTilePixels={this.state.gridTilePixels}
          toolDown={this.toolDown} toolMove={this.toolMove} toolUp={this.toolUp}
          toolOver={this.toolOver} />
      </Container>
    );
  }
}

export default App;
