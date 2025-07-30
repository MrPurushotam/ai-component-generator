import api from "../../lib/api";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
    isLoggedIn: false,
    user: null,
    isLoading: false,
    error: ""
}


const fetchUserThunk = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/");
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
        }
    }
);

const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/auth/logout");
            return;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

const loginUser = createAsyncThunk(
    "auth/login",
    async (idToken, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/google", { idToken });
            return { user: response.data.user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        clearError: (state) => {
            state.error = "";
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(fetchUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.user = action.payload;
                state.error = "";
            })
            .addCase(fetchUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload;
            })
            // logoutUser cases
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
                state.error = "";
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // loginUser cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.user = action.payload.user;
                state.error = "";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
                state.error = action.payload;
            });
    }
})

export const {
    clearError,
} = authSlice.actions;

export { fetchUserThunk, logoutUser, loginUser };
export default authSlice.reducer;