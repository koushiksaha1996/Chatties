import {LOADER} from '../../types/Actiontypes';

const initialState = {
  isVisible: false,
};

const loader = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        isVisible: action.payload,
      };

    default:
      return state;
  }
};

export default loader;
