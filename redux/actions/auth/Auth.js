import { AUTH_STATUS } from "../../types/Actiontypes"

export const authentication=(item)=>{
    return{
        type: AUTH_STATUS,
        payload:item  
    }
    
}