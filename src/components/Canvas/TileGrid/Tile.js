import React, { PureComponent } from 'react';
import styled from 'styled-components';

const GridItem = styled.div.attrs((props) => ({
    style: {
      // grid-column is one based, not zero based
      gridColumn: props.gridColumn + 1,
      color: props.colorFg,
      backgroundColor: props.colorBg,
      width: props.gridTileWidth,
      height: props.gridTileHeight,
      lineHeight: props.gridTileHeight,
    },
  }))`
  left: 50%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;

  margin: 0;
  padding: 0;

  border: 0 solid black;
`;

class Tile extends PureComponent {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  // Avoid binding lambdas in the render function
  onMouseDown() { this.props.toolDown(this.props.row, this.props.col); }
  onMouseMove() { this.props.toolMove(this.props.row, this.props.col); }
  onMouseUp() { this.props.toolUp(this.props.row, this.props.col); }
  onMouseOver() { this.props.toolOver(this.props.row, this.props.col); }

  render() {
    const { row, col, gridTilePixels, tile } = this.props;
    const gridTileHeight = `${gridTilePixels.height}px`;
    const gridTileWidth = `${gridTilePixels.width}px`;
    return (
      <GridItem gridColumn={col} gridTileHeight={gridTileHeight} gridTileWidth={gridTileWidth}
        row={row} col={col} colorFg={tile.colorFg} colorBg={tile.colorBg}
        onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}
        onMouseOver={this.onMouseOver} >
        {tile.glyph}
      </GridItem>
    );
  }
}

export default Tile;
