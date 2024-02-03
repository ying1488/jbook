import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

// define interface
interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [ key: string ]: Cell
  }
}

//define initialstate
const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {}
};

//define reducer 
const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    // cases for actions types that we want to handle in this reducer
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [ id ]: {
            ...state.data[ action.payload.id ],
            content,
          }
        }
      };

    case ActionType.DELETE_CELL:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
};

export default reducer;
