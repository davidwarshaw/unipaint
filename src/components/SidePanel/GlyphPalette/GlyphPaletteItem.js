import React, { PureComponent } from 'react';
import styled from 'styled-components';

import properties from '../../../properties';

const GridItem = styled.td.attrs((props) => ({
    style: {
      width: props.size,
      height: props.size,
      color: props.color,
      backgroundColor: props.bgColor,
    },
  }))`
  font-size: 12px;
  text-align: center;
`;

class GlyphPaletteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.setGlyph = props.setGlyph;
  }

  render() {
    const { row, col, selected, item } = this.props;

    const size = `${properties.colorSwatchSize}px`;
    const char = item;
    const color = selected ? properties.lightSelectionColor : properties.darkSelectionColor;
    const bgColor = selected ? properties.darkSelectionColor : properties.lightSelectionColor;

    const dataTip = `<h1>${item}</h1>`;

    const onMouseDown = () => this.setGlyph(row, col);

    return (
      <GridItem
        size={size} color={color} bgColor={bgColor} data-html data-tip={dataTip}
        onMouseDown={onMouseDown}>
        {char}
      </GridItem>
    );
  }
}

export default GlyphPaletteItem;
