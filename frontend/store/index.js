import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";

export const ReduxStore = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice
    }
});