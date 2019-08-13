import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../properties';

const StyledFileMenu = styled.div`
  display: grid;
  grid-template-rows: repeat(3, ${props => props.styles.menuItemsHeight});
  grid-row-gap: 4px;
  justify-items: center;
  align-items: center;

  margin: 10px;
`;
const MenuItem = styled.button`
  width: 100%;
  height: ${props => props.styles.menuItemsHeight};
  line-height: ${props => props.styles.menuItemsHeight};
  text-align: left;

  font-family: ${props => props.styles.labelFontFamily};
  font-weight: ${props => props.styles.labelFontWeight};
  font-size: ${props => props.styles.labelFontSize};

  cursor: default;
  user-select: none;
`;
const HiddenInput = styled.input`
  display: none;
`;

class FileMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.newFile = props.newFile;
    this.loadJsonFile = props.loadJsonFile;
    this.saveJsonFile = props.saveJsonFile;
    this.savePngFile = props.savePngFile;
  }

  render() {
    const styles = {
      menuItemsHeight: properties.menuItemsHeight,
      labelFontFamily: properties.labelFontFamily,
      labelFontWeight: properties.labelFontWeight,
      labelFontSize: properties.labelFontSize,
    };
    return (
      <StyledFileMenu styles={styles}>
        <MenuItem styles={styles} onClick={this.newFile}
          data-tip="Create a new blank canvas" >New</MenuItem>
        <MenuItem styles={styles}
         data-tip="Load a drawing from a unipaint JSON file" >
          <label>
            Load JSON
            <HiddenInput type="file" accept="application/json" onChange={this.loadJsonFile}/>
          </label>
        </MenuItem>
        <MenuItem styles={styles} onClick={this.saveJsonFile}
          data-tip="Save the current drawing as a unipaint json file" >Save JSON</MenuItem>
        <MenuItem styles={styles} onClick={this.savePngFile}
          data-tip="Not implemented" >Export to PNG</MenuItem>
      </StyledFileMenu>
    );
  }
}

export default FileMenu;
