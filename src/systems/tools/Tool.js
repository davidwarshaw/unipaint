export default class Tool {
  toolDown(state, row, col) {
    if (!state.toolIsActive) {
      const toolIsActive = true;
      const lastToolTile = { row, col };
      return { toolIsActive, lastToolTile };
    }
  }

  toolMove(state, row, col) {
    // Nothing
  }

  toolUp(state, row, col) {
    if (state.toolIsActive) {
      const toolIsActive = false;
      return { toolIsActive };
    }
  }

  toolOver(state, row, col) {
    // Nothing
  }
}
