import { AUTH_STATUS } from "../../types/Actiontypes"

const initialState={
    authentication_status:false
}

const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case AUTH_STATUS: return{
            ...state,
            authentication_status:action.payload
        }
        default : return state
    }
}

export default authReducer