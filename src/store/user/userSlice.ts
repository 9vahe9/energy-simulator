// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { dataBase } from '../../firebaseConfig/firebase';
import { createAppSlice } from "../../app/CreateAppSlice";
import type { RootState } from "../store";
import type { Reducer } from "redux";
import type { IRoomDevice } from '../../types/device';
import type { IRoom } from '../../types/room';
import { DayTime } from '../../constants/DayTime';
import { DeviceType } from '../../constants/Devices';


export interface Device {
    name: string,
    wattage: string,
    deviceId: string
}

// export interface Room {
//     name: string,
//     description: string,
//     levelOfEnergyConsumption: number, // The icon that's either red yellow or green
//     monthlyCost: number,
//     id: string,
//     energyConsumption: number,
//     devices: IRoomDevice[],
// }

// export interface IRoom {
//   id: string;
//   name: string;
//   description: string;
//   energy: number;
//   cost: number;
//   priority: 'High' | 'Medium' | 'Low';
//   devices: IRoomDevice[];        // для реальной выборки из Firebase
//   icons: { type: string; count: number }[]; // плейсхолдер для UI
// }

interface UserState {
    userName: string,
    rooms: IRoom[];
    status: "idle" | "loading" | "failed";
}

const initialState: UserState = {
    userName: "",
    rooms: [{
        id: " ",
        name: " ",
        description: " ",
        energy: 0,
        cost: 0,
        priority: 'Low',
        devices: [{
            name: " ", power: 0, uptime: 0,
            type: DeviceType.Other, workingDayTime: DayTime.Day,
            deviceId: Date.now(), position: { x: 0, y: 0, z: 0 }
        }],
        icons: [{ type: "something", count: 3 }]
    }],
    status: "idle",
}




export const userSlice = createAppSlice({
    name: "user",
    initialState,

    reducers: create => ({

        createUserName: create.asyncThunk<string, { userId: string; newName: string }>(

            async ({ userId, newName }, thunkAPI) => {

                if (!userId) {
                    return thunkAPI.rejectWithValue("No userId");
                }
                try {
                    await setDoc(
                        doc(dataBase, "users", userId),
                        { userName: newName },
                        { merge: true },
                    )
                    return newName;
                }
                catch (err) {
                    console.log("There was an error creating a userName", err);
                    return thunkAPI.rejectWithValue("Api error");
                }
            },
            {
                pending: state => { state.status = "loading" },

                fulfilled: (state, action) => {
                    state.userName = action.payload;
                    state.status = "idle";
                },

                rejected: state => { state.status = "failed" },
            }
        ),


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
                        return thunkAPI.rejectWithValue("Failed to get response")
                    }
                    const data = response.data();
                    return [data?.rooms, data?.userName];
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
                    state.rooms = action.payload[0];
                    state.userName = action.payload[1];
                },

                rejected: (state) => { state.status = "failed"; }
            }
         ),
        // fetchOneRoom: create.asyncThunk <IRoom,{ userId: string; roomId: string } >(

        //     async ({ userId, roomId }, thunkAPI) => {

        //         try {
        //             const response = await getDoc(doc(dataBase, "users", userId))
        //             if (!response.exists()) {
        //                 return thunkAPI.rejectWithValue("Failed to get the room")
        //             }
        //             const data = response.data()
        //             const room = data[roomId];
        //             if (!room) {
        //                 return thunkAPI.rejectWithValue("Room not found");
        //             }
        //             return room;
        //         }
        //         catch (err) {
        //             console.log("error with getting the room");
        //             return thunkAPI.rejectWithValue("Couldn't get the room")
        //         }

        //     },
        //     {
        //         pending: state => {state.status = 'loading'},
        //         fulfilled: state => {state.status = "idle"},
        //         rejected: state => {state.status = "failed"},
        //     }
        // ),


        addRoom: create.asyncThunk(
            async ({ userId, roomObject }: { userId: string, roomObject: IRoom }, thunkAPI) => {

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


        deleteRoom: create.asyncThunk<IRoom[], string>(
            async (roomId: string, thunkAPI) => {

                const state = thunkAPI.getState() as RootState;
                try {
                    const userDocRef = doc(dataBase, "users", state.auth.userToken)

                    const docSnapshot = await getDoc(userDocRef);

                    const currentArray = docSnapshot.exists() ? docSnapshot.data()?.rooms || [] : [];

                    const arrayWithDeletedRoom = currentArray.filter((room: IRoom) => room.id !== roomId)

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

        updateRoom: create.asyncThunk<IRoom, { userId: string; roomObject: IRoom }>(
            async ({ userId, roomObject }, thunkAPI) => {

                try {

                    if (!userId) {
                        return thunkAPI.rejectWithValue("No userId");
                    }

                    const userDocRef = doc(dataBase, "users", userId);
                    const snap = await getDoc(userDocRef);

                    if (!snap.exists()) {
                        return thunkAPI.rejectWithValue("user document not found");
                    }


                    const current: IRoom[] = snap.data()?.rooms || []
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
        ),


    }),

    selectors: {
        selectRooms: user => user.rooms,
        selectStatus: user => user.status,
    }
},
)

export const userReducer: Reducer<UserState> = userSlice.reducer;
export const { createRoom, fetchRooms, addRoom, deleteRoom, updateRoom, createUserName,  } = userSlice.actions;
export const { selectRooms, selectStatus } = userSlice.selectors;

