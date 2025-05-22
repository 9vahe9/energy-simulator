import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "./authentication/Authslice"
import { userReducer } from "./user/userSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'



// Persist only auth slice
const persistedAuthReducer = persistReducer(
  { key: 'auth', storage, whitelist: ['userToken', 'email'] },
  authReducer
);

// Create store with persistence (default middleware)
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;