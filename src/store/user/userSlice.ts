import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from 'firebase/firestore';
import { dataBase } from '../../firebaseConfig/firebase';
import { createAppSlice } from "../../app/CreateAppSlice";




interface Device {
    name: string,
    wattage: string,
}

export interface Room {
    name: string,
    description: string,
    levelOfEnergyConsumption: string, // The icon that's either red yellow or green
    monthlyCost: string,
    energyConsumption: string,
    devices: Device[],
}


type UserState = {
     room: Room;
     rooms: Room[];
     status: "idle" | "loading" | "failed";
}

const userId = sessionStorage.getItem("userToken");

const initialState: UserState = {
    room: {
    name: "",
    description: "",
    levelOfEnergyConsumption: "",
    monthlyCost: "",
    energyConsumption: "",
    devices: [],
  },
  rooms: [],
  status: "idle",
}


export const userSlice = createAppSlice({
    name: "user",
    initialState,

    reducers: create => ({
        // addRoom: create.reducer((state, action: PayloadAction<Room>) => {
        //     state.rooms.push(action.payload);
        // }),

        addRoom: create.asyncThunk(
            async (room: Room[]) => {

                await setDoc(doc(dataBase, ))
            }
        )

        fetchRooms: create.asyncThunk(
            async (userId:string, thunkAPI) =>{
                if(!userId){
                    return thunkAPI.rejectWithValue("No user ID");
                }

                try {
                    const response = await getDoc(doc(dataBase, "userRooms", userId));
                    if(response.exists()){
                        return [];
                    }
                    const data = response.data();
                    return data?.rooms;
                }
                catch(err){
                    console.log("Something went wrong");
                    return thunkAPI.rejectWithValue("Failed to fetch")
                }
            },
            {
                pending: state => {
                    state.status = "idle";
                },

                fulfilled: (state, action) => {
                    state.rooms = action.payload;
                },

                rejected: (state) => {
                    state.status = "failed";
                }
            }
        )        
}),

        selectors: {
            selectRooms: user => user.rooms,
            selectStatus: user => user.status,
        }

})

export const userReducer = userSlice.reducer;
export const { addRoom, fetchRooms } = userSlice.actions;
export const { selectRooms, selectStatus } = userSlice.selectors;

// const initialState: { age: number; room: Room, rooms: Array<Room> } = {
//     age: 0,
//     room: {
//         name: "",
//         description: "",
//         levelOfEnergyConsumption: "",
//         monthlyCost: "",
//         energyConsumption: "",
//         devices: [],
//     },
//     rooms: [],
// }


// export const fetchRooms = createAsyncThunk<Object, string> (
//     'user/fetchRooms',
//     async (userId: string, thunkAPI) => {
//         if (!userId) {
//             return thunkAPI.rejectWithValue("No user ID");
//         }

//         try {
//             const snap = await getDoc(doc(dataBase, 'userRooms', userId));
//             if (!snap.exists()) {
//                 thunkAPI.dispatch(setRooms([]));
//             } else {
//                 const data = snap.data();
//                 thunkAPI.dispatch(setRooms(data.rooms));
//                 return data.rooms;
//             }
//         }
//         catch (err) {
//             console.log("There was an error");
//             return thunkAPI.rejectWithValue("Failed to fetch rooms");
//         }
//     }
// )



// const userSlice = createSlice({

//     name: 'user',
//     initialState,

//     reducers: {

//         addRoom: (state, action: PayloadAction<Room>) => {
//             state.rooms.push(action.payload);
//         },

//         setRooms: (state, action: PayloadAction<Room[]>) => {
//             state.rooms = action.payload;
//         }
//     }
// })


// export const { addRoom, setRooms } = userSlice.actions;
// export const userReducer = userSlice.reducer;
