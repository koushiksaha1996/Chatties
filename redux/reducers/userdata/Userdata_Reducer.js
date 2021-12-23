import {ADD_USER_DATA} from '../../types/Actiontypes';

const initialState = {
  ID: '',
  email: '',
  user_name: '',
  display_pic: '',
  tokenID: '',
  isactive: '',
  lastSeen: '',
};

const userData = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_DATA:
      return {
        ...state,
        ID: action.payload._id,
        email: action.payload.email,
        user_name: action.payload.name,
        display_pic: action.payload.profileUrl,
        tokenID: action.payload.tokenid,
        isactive: action.payload.isActive,
        lastSeen: action.payload.lastSeen,
      };
    default:
      return state;
  }
};

export default userData;
