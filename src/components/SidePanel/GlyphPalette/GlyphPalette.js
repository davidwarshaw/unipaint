import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../../properties';

import GlyphPaletteItem from './GlyphPaletteItem';

const Grid = styled.table`
  cursor: default;
  user-select: none;

  font-family: ${props => props.styles.tileFontFamily};
  font-weight: ${props => props.styles.tileFontWeight};
  font-size: ${props => props.styles.tileFontSize};

  border-collapse: separate;
  border-spacing: 1px;

  margin: 10px;
`;
const GridBody = styled.tbody`
`;
const GridRow = styled.tr`
`;


class GlyphPalette extends PureComponent {
  constructor(props) {
    super(props);
    this.setGlyph = props.setGlyph;
  }

  render() {
    const styles = {
      tileFontFamily: properties.tileFontFamily,
      tileFontWeight: properties.tileFontWeight,
      tileFontSize: properties.tileFontSize,
    };
    const { items, paletteGlyph } = this.props;
    const colorPaletteRows = items.map((itemRow, row) => {
      return (
        <GridRow key={row}>
          {itemRow.map((item, col) => {
            const key = `${row}-${col}`;
            const selected = row === paletteGlyph.row && col === paletteGlyph.col;
            return (
              <GlyphPaletteItem
                key={key} row={row} col={col} selected={selected} item={item}
                setGlyph={this.setGlyph}/>
            )
          })}
        </GridRow>
      );
    });
    return (
      <Grid styles={styles}>
        <GridBody>
          {colorPaletteRows}
        </GridBody>
      </Grid>
    );
  }
}

export default GlyphPalette;
