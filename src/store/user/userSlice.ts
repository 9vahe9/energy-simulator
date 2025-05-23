import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from 'firebase/firestore';
import { dataBase } from '../../firebaseConfig/firebase';


interface Room {
    name: string,
    description: string,
    levelOfEnergyConsumption: string, // The icon that's either red yellow or green
    monthlyCost: string,
    energyConsumption: string,
}


const initialState: { age: number; room: Room, rooms: Array<Room> } = {
    age: 0,
    room: {
        name: "",
        description: "",
        levelOfEnergyConsumption: "",
        monthlyCost: "",
        energyConsumption: "",
    },
    rooms: [],
}

// const fetchData = createAsyncThunk(
//      'user/fetchRooms', 
//      async(userId, thunkAPI) => {
//         const docRef = doc(dataBase, "users", userId);
//         const snap = await getDoc(docRef);
//         if(!snap.exists()){
//             return [];
//         }

//     const data = snap.data() as { rooms?: Room[] };
//     return data.rooms ?? [];
//      }
// )


const userSlice = createSlice({

    name: 'user',
    initialState,

    reducers: {

        setAge: (state, action) => {
            state.age = action.payload;
        },
        addRoom: (state, action: PayloadAction<Room>) => {
            state.rooms.push(action.payload);
        }

    }


})


export const { setAge, addRoom } = userSlice.actions;
export const userReducer = userSlice.reducer;