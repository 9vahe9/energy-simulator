import { createSlice } from "@reduxjs/toolkit";
// import { auth } from "../../firebaseConfig/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth"
// import { signInWithEmailAndPassword } from "firebase/auth";

const initialState = {
    email: "",
    password: "",
    userToken: null,
}


const authSlice = createSlice({

    name: "auth",
    initialState, 
    reducers: {

        setEmail:  (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        }

    }


})



export const { setEmail, setPassword } = authSlice.actions;
export const authReducer = authSlice.reducer;