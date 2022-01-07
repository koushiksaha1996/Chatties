import { createStore ,applyMiddleware , combineReducers} from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth/Auth_Reducer";
import userData from "./reducers/userdata/Userdata_Reducer";
import loader from "./reducers/Loader/Loader_reducer"

const rootReducer=combineReducers({
        Auth: authReducer,
        UserData: userData,
        Loader: loader
    })
export const store = createStore(rootReducer,applyMiddleware(thunk))