import React, { PureComponent } from 'react';
import styled from 'styled-components';

import ColorPaletteItem from './ColorPaletteItem';

const Grid = styled.table`
  cursor: default;
  user-select: none;

  border-collapse: separate;
  border-spacing: 1px;

  margin: 10px;
`;
const GridBody = styled.tbody`
`;
const GridRow = styled.tr`
`;


class ColorPalette extends PureComponent {
  constructor(props) {
    super(props);
    this.setColor = props.setColor;
  }

  render() {
    const { items, paletteColorFg, paletteColorBg } = this.props;
    const colorPaletteRows = items.map((itemRow, row) => {
      return (
        <GridRow key={row}>
          {itemRow.map((item, col) => {
            const key = `${row}-${col}`;
            const selectedFg = row === paletteColorFg.row && col === paletteColorFg.col;
            const selectedBg = row === paletteColorBg.row && col === paletteColorBg.col;
            return (
              <ColorPaletteItem
                key={key} row={row} col={col} selectedFg={selectedFg} selectedBg={selectedBg}
                item={item} setColor={this.setColor}/>
            )
          })}
        </GridRow>
      );
    });
    return (
      <Grid >
        <GridBody>
          {colorPaletteRows}
        </GridBody>
      </Grid>
    );
  }
}

export default ColorPalette;
