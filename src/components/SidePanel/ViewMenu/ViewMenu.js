import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../../properties';

import ToolIcon from '../MiddleCluster/ToolIcon';

const StyledViewMenu = styled.div`
  display: grid;
  grid-template-rows: repeat(1, ${props => props.styles.iconSize});
  grid-template-columns: repeat(5, ${props => props.styles.iconSize});
  grid-gap: 10px;
  justify-items: center;
  align-items: center;

  margin: 10px;
`;
const MenuItem = styled.button`
  grid-row: ${props => props.row};
  grid-column: ${props => props.col};
  width: ${props => props.styles.iconSize};
  display: flex;
  align-items: center;
  text-align: center;
  height: 100%;

  font-family: ${props => props.styles.labelFontFamily};
  font-weight: ${props => props.styles.labelFontWeight};
  font-size: ${props => props.styles.labelFontSize};

  cursor: default;
  user-select: none;
`;
const ResizeContainer = styled.div`
  grid-row: ${props => props.row};
  grid-column-start: ${props => props.colStart};
  grid-column-end: ${props => props.colEnd};
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: repeat(1, ${props => props.styles.iconSize});
  grid-gap: 10px;
  justify-items: center;
  align-items: center;

  margin: 10px;
`;
const ResizeInput = styled.input`
  grid-row: ${props => props.row};
  grid-column-start: ${props => props.colStart};
  grid-column-end: ${props => props.colEnd};
  width: 100%;
`;
const ResizeLabel = styled.div`
  grid-row: ${props => props.row};
  grid-column-start: ${props => props.colStart};
  grid-column-end: ${props => props.colEnd};
  width: 100%;
`;
const ResizeReset = styled.button`
  grid-row: ${props => props.row};
  grid-column-start: ${props => props.colStart};
  grid-column-end: ${props => props.colEnd};
  width: 100%;

  font-family: ${props => props.styles.labelFontFamily};
  font-weight: ${props => props.styles.labelFontWeight};
  font-size: ${props => props.styles.labelFontSize};

  cursor: default;
  user-select: none;
`;

class ViewMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.resize = () => props.resize();
    this.resizeReset = () => props.resizeReset();
    this.setResizeWidth = (event) => props.setResizeWidth(event);
    this.setResizeHeight = (event) => props.setResizeHeight(event);
  }

  render() {
    const styles = {
      menuItemsHeight: properties.menuItemsHeight,
      iconSize: properties.iconSize,
      labelFontFamily: properties.labelFontFamily,
      labelFontWeight: properties.labelFontWeight,
      labelFontSize: properties.labelFontSize,
      smallLabelFontSize: properties.smallLabelFontSize,
    };
    const { resetGridWidth, resetGridHeight } = this.props;
    const fgColor = properties.darkSelectionColor;
    return (
      <StyledViewMenu styles={styles}>
        <MenuItem styles={styles} row={1} col={1}
          onClick={this.resize}
          data-tip="Resize the tile grid to the selected width and height" >
          <ToolIcon name={'crop'} fgColor={fgColor} />
        </MenuItem>
        <ResizeContainer styles={styles} row={1} colStart={2} colEnd={6} >
          <ResizeInput styles={styles} row={1} colStart={1} colEnd={3}
            type="number" value={resetGridWidth} onChange={this.setResizeWidth} />
          <ResizeLabel styles={styles} row={1} colStart={3} colEnd={4} >x</ResizeLabel>
          <ResizeInput styles={styles} row={1} colStart={4} colEnd={6}
            type="number" value={resetGridHeight} onChange={this.setResizeHeight} />
          <ResizeReset styles={styles} row={1} colStart={6} colEnd={7}
            onClick={this.resizeReset}
            data-tip="Reset the resize width and height to the current width and height" >
              reset</ResizeReset>
        </ResizeContainer>
      </StyledViewMenu>
    );
  }
}

export default ViewMenu;
