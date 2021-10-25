import { createStore ,applyMiddleware , combineReducers} from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth/Auth_Reducer";

const rootReducer=combineReducers({
        Auth: authReducer
    })
export const store = createStore(rootReducer,applyMiddleware(thunk))