import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "./authentication/authSlice"
import { userReducer } from "./user/userSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },
});



export type RootState = ReturnType<typeof store.getState>;
export default store;