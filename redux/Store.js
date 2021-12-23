import { createStore ,applyMiddleware , combineReducers} from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth/Auth_Reducer";
import userData from "./reducers/userdata/Userdata_Reducer";

const rootReducer=combineReducers({
        Auth: authReducer,
        UserData: userData
    })
export const store = createStore(rootReducer,applyMiddleware(thunk))