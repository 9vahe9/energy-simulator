import { createSlice} from "@reduxjs/toolkit";


const initialState = {
    age: 0
}


const userSlice = createSlice({

    name: 'user',
    initialState,

    reducers: {

        setAge: (state, action) => {
            state.age = action.payload;
        }

    }


})


export const {setAge} = userSlice.actions;
export const userReducer = userSlice.reducer;