import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../properties';

import ColorPalette from './ColorPalette/ColorPalette';
import MiddleCluster from './MiddleCluster/MiddleCluster';
import GlyphPalette from './GlyphPalette/GlyphPalette';
import FileMenu from './FileMenu/FileMenu';
import ViewMenu from './ViewMenu/ViewMenu';

const StyledSidePanel = styled.div`
  height: 100%;
  width: ${props => props.styles.sidePanelWidth}px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: ${props => props.styles.sidePanelBgColor};
  overflow-x: hidden;

  font-family: ${props => props.styles.labelFontFamily};
  font-weight: ${props => props.styles.labelFontWeight};
  font-size: ${props => props.styles.labelFontSize};

  margin: 0;
  padding: 0;

  border: 0px solid red;
`;

const SidePanelFooter = styled.div`
  font-size: x-small;
  margin: 4px;
  padding: 4px;
`;

class SidePanel extends PureComponent {
  render() {
    const styles = {
      sidePanelWidth: properties.sidePanelWidth,
      sidePanelBgColor: properties.sidePanelBgColor,
      labelFontFamily: properties.labelFontFamily,
      labelFontWeight: properties.labelFontWeight,
      labelFontSize: properties.labelFontSize,
    };
    const {
      colors, glyphs, colorFg, colorBg, glyph, paletteColorFg, paletteColorBg, fgColorSelected,
      paletteGlyph, selectedTool,
      resetGridWidth, resetGridHeight,
      setColor, setColorFgSelected, setGlyph, setColorValue, setGlyphValue, setSelectedTool,
      resize,  resizeReset, setResizeWidth, setResizeHeight,
      newFile, loadJsonFile, saveJsonFile, savePngFile,
    } = this.props;
    return (
      <StyledSidePanel styles={styles} >
        <ColorPalette
          items={colors} paletteColorFg={paletteColorFg} paletteColorBg={paletteColorBg}
          setColor={setColor} />
        <MiddleCluster
          colorFg={colorFg} colorBg={colorBg} glyph={glyph} fgColorSelected={fgColorSelected}
          selectedTool={selectedTool}
          setColorFgSelected={setColorFgSelected} setSelectedTool={setSelectedTool}
          setColorValue={setColorValue} setGlyphValue={setGlyphValue} />
        <GlyphPalette items={glyphs} paletteGlyph={paletteGlyph} setGlyph={setGlyph} />
        <ViewMenu resetGridWidth={resetGridWidth} resetGridHeight={resetGridHeight}
          resize={resize} resizeReset={resizeReset}
          setResizeWidth={setResizeWidth} setResizeHeight={setResizeHeight} />
        <FileMenu newFile={newFile} loadJsonFile={loadJsonFile} saveJsonFile={saveJsonFile}
          savePngFile={savePngFile}/>
        <SidePanelFooter>
          unipaint v1.3 2019-09-03
        </SidePanelFooter>
      </StyledSidePanel>
    );
  }
}

export default SidePanel;
