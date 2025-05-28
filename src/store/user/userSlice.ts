import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { dataBase } from '../../firebaseConfig/firebase';
import { createAppSlice } from "../../app/CreateAppSlice";
import type { RootState } from "../store";
import type { Reducer } from "redux";



export interface Device {
    name: string,
    wattage: string,
}

export interface Room {
    name: string,
    description: string,
    levelOfEnergyConsumption: string, // The icon that's either red yellow or green
    monthlyCost: string,
    id: string,
    energyConsumption: string,
    devices: Device[],
}


interface UserState {
    //room: Room;
    rooms: Room[];
    status: "idle" | "loading" | "failed";
}



const initialState: UserState = {

    rooms: [{
        name: " ",
        description: " ",
        levelOfEnergyConsumption: " ",
        monthlyCost: " ",
        energyConsumption: " ",
        id: " ",
        devices: [{ name: " ", wattage: " " }],
    }],
    status: "idle",
}




export const userSlice = createAppSlice({
    name: "user",
    initialState,

    reducers: create => ({

        createRoom: create.asyncThunk<void, string>(
            async (userId, thunkAPI) => {
                const state = thunkAPI.getState() as RootState;

                if (!userId) {
                    return thunkAPI.rejectWithValue("No user Id");
                }

                try {
                    await setDoc(
                        doc(dataBase, "users", userId),
                        { rooms: state.user.rooms },
                        { merge: true }
                    );

                } catch (err) {
                    console.error("Failed to create room:", err);
                    return thunkAPI.rejectWithValue("Firestore error");
                }
            },
            {
                pending: state => { state.status = "loading" },
                fulfilled: state => { state.status = "idle"; },
                rejected: state => { state.status = "failed" },
            }
        ),


        fetchRooms: create.asyncThunk(
            async (userId: string, thunkAPI) => {
                if (!userId) {
                    return thunkAPI.rejectWithValue("No user ID");
                }

                try {
                    const response = await getDoc(doc(dataBase, "users", userId));
                    if (!response.exists()) {
                        return [];
                    }
                    const data = response.data();
                    return data?.rooms;
                }
                catch (err) {
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

                rejected: (state) => { state.status = "failed"; }
            }
        ),


        addRoom: create.asyncThunk(
            async ({ userId, roomObject }: { userId: string, roomObject: Room }, thunkAPI) => {

                try {

                    const userDocRef = doc(dataBase, "users", userId)

                    const docSnapshot = await getDoc(userDocRef);

                    const existingRooms = docSnapshot.exists() ? docSnapshot.data()?.rooms || [] : [];

                    console.log(existingRooms)
                    await setDoc(doc(dataBase, "users", userId),
                        { rooms: [...existingRooms, roomObject] },
                        { merge: true }
                    );
                    return roomObject;
                }
                catch (err) {
                    console.log("There has been an error", err);
                    return thunkAPI.rejectWithValue("Something went wrong");
                }
            },

            {
                pending: (state) => { state.status = "loading"; },

                fulfilled: (state, action) => {
                    state.rooms = [...state.rooms, action.payload];
                    state.status = "idle";
                },

                rejected: (state) => { state.status = "failed" },
            }
        ),


        deleteRoom: create.asyncThunk<Room[], string>(
            async (roomId: string, thunkAPI) => {

                const state = thunkAPI.getState() as RootState;
                try {
                    const userDocRef = doc(dataBase, "users", state.auth.userToken)

                    const docSnapshot = await getDoc(userDocRef);

                    const currentArray = docSnapshot.exists() ? docSnapshot.data()?.rooms || [] : [];

                    const arrayWithDeletedRoom = currentArray.filter((room: Room) => room.id !== roomId)

                    await setDoc(doc(dataBase, "users", state.auth.userToken),
                        { rooms: arrayWithDeletedRoom },
                        { merge: true }
                    );
                    return arrayWithDeletedRoom;
                }
                catch (err) {
                    console.log("There has been an error", err);
                    return thunkAPI.rejectWithValue("Something went wrong");
                }

            },
            {
                pending: state => { state.status = "loading" },

                rejected: state => { state.status = "failed" },

                fulfilled: (state, action) => {
                    state.rooms = action.payload;
                    state.status = "idle"
                },
            }
        ),

        updateRoom: create.asyncThunk<Room, {userId: string; roomObject: Room}>(
            async ({ userId, roomObject }, thunkAPI) => {

                try {

                if (!userId) {
                    return thunkAPI.rejectWithValue("No userId");
                }

                    const userDocRef = doc(dataBase, "users", userId);
                    const snap = await getDoc(userDocRef);
                    
                    if(!snap.exists()){
                        return thunkAPI.rejectWithValue("user document not found");
                    }

                    
                    const current: Room[] = snap.data()?.rooms || []
                    const updatedRooms = current.map((r) => {
                       return r.id === roomObject.id ? roomObject : r;
                    })

                    await setDoc(userDocRef,
                        { rooms: updatedRooms },
                        { merge: true }
                    )
                    return roomObject;
                }
                catch (err) {
                    console.log("something went wrong", err);
                    return thunkAPI.rejectWithValue("Firestore error");
                }
            },

            {
                pending: state => { state.status = "loading" },
                fulfilled: (state, action) => {
                    state.rooms = state.rooms.map((room) => {
                        return room.id === action.payload.id ?
                            room = action.payload : room;
                    })
                    state.status = "idle";
                },
                rejected: state => {
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

export const userReducer: Reducer<UserState> = userSlice.reducer;
export const { createRoom, fetchRooms, addRoom, deleteRoom, updateRoom } = userSlice.actions;
export const { selectRooms, selectStatus } = userSlice.selectors;

