//luu tru thong tin user
//user co thong tin gi

import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/user";
import axios from "axios";


//default value           user nay vua moi tao 1 la user 2 la null
const initialState: null | User = null;

export const userSlice = createSlice({
    name: "user",
    initialState, // => initialState: initialState
    reducers:{
        login: (state, actions) => actions.payload, //===user

        logout: () => initialState,
    },
});
export const{ login, logout} = userSlice.actions;

export default userSlice.reducer;

