import { ADD_USER_DATA } from "../../types/Actiontypes"

export const adduser=(item)=>{
    return{
        type: ADD_USER_DATA,
        payload:item  
    }
    
}