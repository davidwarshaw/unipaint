import Pencil from './tools/Pencil';
import Bucket from './tools/Bucket';
import EyeDropper from './tools/EyeDropper';
import Line from './tools/Line';
import Rectangle from './tools/Rectangle';
import Circle from './tools/Circle';
import PaintRoller from './tools/PaintRoller';
import Type from './tools/Type';

export default class ToolDispatch {
  constructor() {
    this.tool = {}
    this.tool['pencil'] = new Pencil();
    this.tool['bucket'] = new Bucket();
    this.tool['eye-dropper'] = new EyeDropper();
    this.tool['line'] = new Line();
    this.tool['rectangle'] = new Rectangle();
    this.tool['circle'] = new Circle();
    this.tool['paint-roller'] = new PaintRoller();
    this.tool['type'] = new Type();
  }
  
  toolDown(state, row, col) {
    return this.tool[state.selectedTool].toolDown(state, row, col);
  }

  toolMove(state, row, col) {
    return this.tool[state.selectedTool].toolMove(state, row, col);
  }

  toolUp(state, row, col) {
    return this.tool[state.selectedTool].toolUp(state, row, col);
  }

  toolOver(state, row, col) {
    return this.tool[state.selectedTool].toolOver(state, row, col);
  }
}
