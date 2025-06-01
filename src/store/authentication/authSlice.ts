import { createSlice } from "@reduxjs/toolkit";
// import { auth } from "../../firebaseConfig/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth"
// import { signInWithEmailAndPassword } from "firebase/auth";



const token = sessionStorage.getItem("userToken");


interface AuthState  {
    email: string,
    password: string,
    userToken: any,
}

const initialState: AuthState = {
    email: "",
    password: "",
    userToken: token,
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
        },
        setCurrentUser: (state, action) => {
            state.userToken = action.payload;
        }

    }


})



export const { setEmail, setPassword, setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;