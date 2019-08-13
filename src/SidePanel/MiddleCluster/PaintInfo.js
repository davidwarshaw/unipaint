import React, { PureComponent } from 'react';
import styled from 'styled-components';

import convert from 'color-convert';

import properties from '../../properties';

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, ${props => props.styles.size});
  grid-template-rows: repeat(3, ${props => props.styles.size});
  grid-gap: 10px;
  grid-row-gap: 20px;
  justify-items: center;
  align-items: center;

  font-size: 12px;
  text-align: center;
`;
const InfoContainer = styled.div`
  grid-row: ${props => props.row};
  grid-column: ${props => props.col};

  background-color: ${props => props.tileColor};

  width: ${props => props.styles.size};
  height: ${props => props.styles.size};

  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const Item = styled.div`
  font-family: ${props => props.styles.tileFontFamily};
  font-weight: ${props => props.styles.tileFontWeight};
  font-size: ${props => props.styles.tileFontSize};

  color: ${props => props.selectionColor};

  cursor: default;
  user-select: none;
  vertical-align: middle;

  font-size: 24px;
`;
const ItemForm = styled.div`
  text-align: left;
  font-size: 12px;
`;
const ColorInput = styled.input`
  width: 40px;
`;
const GlyphInput = styled.input`
  width: 40px;
`;

class PaintInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.onMouseDownFg = () => props.setColorFgSelected(true);
    this.onMouseDownBg = () => props.setColorFgSelected(false);
    this.onColorInputFg = (event) => props.setColorValue(event, true);
    this.onColorInputBg = (event) => props.setColorValue(event, false);
    this.onGlyphInput = (event) => props.setGlyphValue(event);
  }

  render() {
    const styles = {
      tileFontFamily: properties.tileFontFamily,
      tileFontWeight: properties.tileFontWeight,
      tileFontSize: properties.tileFontSize,
      size: properties.iconSize,
    };
    const { colorFg, colorBg, glyph, fgColorSelected } = this.props;

    const fgBorder = fgColorSelected ? properties.selectionThickness : '0';
    const bgBorder = !fgColorSelected ? properties.selectionThickness : '0';

    const lightness = fgColorSelected ? convert.hex.hsl(colorFg)[2] : convert.hex.hsl(colorBg)[2];
    const selectionColor = lightness >= 50 ? properties.darkSelectionColor : properties.lightSelectionColor;

    const fgGlyph = fgColorSelected ? 'F' : '';
    const bgGlyph = !fgColorSelected ? 'B' : '';

    const charCode = glyph.charCodeAt().toString(16).toUpperCase().padStart(4, '0');

    return (
      <InfoGrid styles={styles} >
        <InfoContainer styles={styles} row={1} col={1} tileColor={colorBg}
          onMouseDown={this.onMouseDownBg} data-tip="Select background color from palette" >
          <Item styles={styles} border={bgBorder}
            selectionColor={selectionColor} >{bgGlyph}</Item>
        </InfoContainer>
        <InfoContainer styles={styles} row={1} col={2} data-tip="Update background color">
          <ItemForm>
            <ColorInput type="color" value={colorBg}
              onInput={this.onColorInputBg} onChange={this.onColorInputBg} />
          </ItemForm>
        </InfoContainer>
        <InfoContainer styles={styles} row={2} col={1} tileColor={colorFg}
          onMouseDown={this.onMouseDownFg} data-tip="Select foreground color from palette" >
          <Item styles={styles} border={fgBorder}
          selectionColor={selectionColor} >{fgGlyph}</Item>
        </InfoContainer>
        <InfoContainer styles={styles} row={2} col={2} data-tip="Update foreground color" >
          <ItemForm>
            <ColorInput type="color" value={colorFg}
              onInput={this.onColorInputFg} onChange={this.onColorInputFg} />
          </ItemForm>
        </InfoContainer>
        <InfoContainer styles={styles} row={3} col={1} >
          <Item styles={styles} >{glyph}</Item>
        </InfoContainer>
        <InfoContainer styles={styles} row={3} col={2} data-tip="Enter a four digit hex char code, or paste a single character" >
          <ItemForm>
            <GlyphInput align="middle" type="text" value={charCode}
            onInput={this.onGlyphInput} onChange={this.onGlyphInput} />
          </ItemForm>
        </InfoContainer>
      </InfoGrid>
    );
  }
}

export default PaintInfo;
