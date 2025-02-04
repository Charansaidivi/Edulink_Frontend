import { createSlice } from "@reduxjs/toolkit";
export const LoginSlice =createSlice({
    name: 'Loginstate',
    initialState: {
        login:true
    },
    reducers: {
        setLogin:(state)=>{
            state.login=false
        }
    }
});
export const {setLogin}=counterSlice.actions
export default counterSlice.reducer