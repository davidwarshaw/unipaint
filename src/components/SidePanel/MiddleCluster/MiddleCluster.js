import React, { PureComponent } from 'react';
import styled from 'styled-components';

import PaintInfo from './PaintInfo';
import ToolSelector from './ToolSelector';

const StyledMiddleCluster = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;

  margin: 10px;
`;
const SideBySide = styled.div`
  grid-row: 1;
`;

class MiddleCluster extends PureComponent {
  render() {
    const {
      colorFg, colorBg, glyph, fgColorSelected, selectedTool,
      setColorFgSelected, setColorValue, setGlyphValue, setSelectedTool,
    } = this.props;
    return (
      <StyledMiddleCluster>
        <SideBySide>
          <PaintInfo colorFg={colorFg} colorBg={colorBg} glyph={glyph}
            fgColorSelected={fgColorSelected} setColorFgSelected={setColorFgSelected}
            setColorValue={setColorValue} setGlyphValue={setGlyphValue} />
        </SideBySide>
        <SideBySide>
          <ToolSelector selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </SideBySide>
      </StyledMiddleCluster>
    );
  }
}

export default MiddleCluster;
