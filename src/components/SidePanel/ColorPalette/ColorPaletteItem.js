import React, { PureComponent } from 'react';
import styled from 'styled-components';

import convert from 'color-convert';

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

class ColorPaletteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.setColor = props.setColor;
  }

  render() {
    const { row, col, selectedFg, selectedBg, item } = this.props;

    const size = `${properties.colorSwatchSize}px`;
    const lightness = convert.hex.hsl(item)[2];
    const selectionColor = lightness >= 50 ? properties.darkSelectionColor : properties.lightSelectionColor;

    let char = '█';
    if (selectedFg && selectedBg) {
      char = '&';
    } else if (selectedFg && !selectedBg) {
      char = 'F';
    } else if (!selectedFg && selectedBg) {
      char = 'B';
    }
    const color = selectedFg || selectedBg ? selectionColor : item;
    const bgColor = item;

    const [ r, g, b ] = convert.hex.rgb(item);
    const dataTip = `${item} (${r}, ${g}, ${b})`;

    const onMouseDown = () => this.setColor(row, col);

    return (
      <GridItem
        size={size} color={color} bgColor={bgColor} data-tip={dataTip}
        onMouseDown={onMouseDown}>
        {char}
      </GridItem>
    );
  }
}

export default ColorPaletteItem;
