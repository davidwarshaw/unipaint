import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../../properties';

import ToolIcon from './ToolIcon';

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, ${props => props.styles.size});
  grid-template-rows: repeat(4, ${props => props.styles.size});
  grid-gap: 10px;
  justify-items: space-evenly;
  align-items: center;

  font-size: 12px;
  text-align: center;
`;
const IconContainer = styled.button`
  grid-row: ${props => props.row};
  grid-column: ${props => props.col};
  background-color: ${props => props.bgColor};

  width: ${props => props.styles.size};
  display: flex;
  align-items: center;
  text-align: center;
  height: 100%;
`;

//pencil tool by icon 54 from the Noun Project

class ToolSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.setSelectedTool = props.setSelectedTool;
  }

  render() {
    const styles = {
      size: properties.iconSize,
    };
    const { selectedTool } = this.props;
    const fgForTool = (tool) => tool !== selectedTool ?
      properties.darkSelectionColor : properties.lightSelectionColor;
    const bgForTool = (tool) => tool === selectedTool ?
      properties.darkSelectionColor : '';
    return (
      <ToolGrid styles={styles} >
        <IconContainer styles={styles} row={1} col={1} bgColor={bgForTool('pencil')}
          onClick={() => this.setSelectedTool('pencil')} data-tip="Paint with the current colors and glyph" >
          <ToolIcon name={'pencil'} fgColor={fgForTool('pencil')} />
        </IconContainer>
        <IconContainer styles={styles} row={2} col={1} bgColor={bgForTool('eye-dropper')}
          onClick={() => this.setSelectedTool('eye-dropper')} data-tip="Update the color and glyph palette to match the selected tile" >
          <ToolIcon name={'eye-dropper'} fgColor={fgForTool('eye-dropper')} />
        </IconContainer>
        <IconContainer styles={styles} row={3} col={1} bgColor={bgForTool('paint-roller')}
          onClick={() => this.setSelectedTool('paint-roller')} data-tip="Paint with the current colors only (no glyph)" >
          <ToolIcon name={'paint-roller'} fgColor={fgForTool('paint-roller')} />
        </IconContainer>
        <IconContainer styles={styles} row={4} col={1} bgColor={bgForTool('type')}
          onClick={() => this.setSelectedTool('type')} data-tip="Paint with the current glyph only (no colors)" >
          <ToolIcon name={'type'} fgColor={fgForTool('type')} />
        </IconContainer>
        <IconContainer styles={styles} row={1} col={2} bgColor={bgForTool('bucket')}
          onClick={() => this.setSelectedTool('bucket')} data-tip="Flood fill the current colors and glyph" >
          <ToolIcon name={'bucket'} fgColor={fgForTool('bucket')} />
        </IconContainer>
        <IconContainer styles={styles} row={2} col={2} bgColor={bgForTool('line')}
          onClick={() => this.setSelectedTool('line')} data-tip="Paint a line with the current colors and glyph" >
          <ToolIcon name={'line'} fgColor={fgForTool('line')} />
        </IconContainer>
        <IconContainer styles={styles} row={3} col={2} bgColor={bgForTool('rectangle')}
          onClick={() => this.setSelectedTool('rectangle')} data-tip="Paint a rectangle with the current colors and glyph" >
          <ToolIcon name={'rectangle'} fgColor={fgForTool('rectangle')} />
        </IconContainer>
        <IconContainer styles={styles} row={4} col={2} bgColor={bgForTool('circle')}
          onClick={() => this.setSelectedTool('circle')} data-tip="Not implemented" >
          <ToolIcon name={'circle'} fgColor={fgForTool('circle')} />
        </IconContainer>
      </ToolGrid>
    );
  }
}

export default ToolSelector;
