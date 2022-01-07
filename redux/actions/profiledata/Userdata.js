import { ADD_USER_DATA, PROFILE_PIC } from "../../types/Actiontypes"

export const adduser=(item)=>{
    return{
        type: ADD_USER_DATA,
        payload:item  
    }
    
}
export const addProfilePic=(item)=>{
    return{
        type:PROFILE_PIC,
        payload:item
    }
}