import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
    name: 'auth',
    initialState: {
        user:"null",
    },
    reducers: {
        setuser: (state, action) => {
            state.user = action.payload;
            window.localStorage.setItem('user', JSON.stringify(action.payload))

        },
        deluser: (state) => {
            state.user = null;
            window.localStorage.removeItem('user');
        },
        setuserfromlocal: (state) => {
            var user = window.localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                state.user = user;
            }
            else {
                state.user = null;
            }
        }
    }
});
export const { setuser, deluser, setuserfromlocal,setlist } =authslice.actions;
export default authslice.reducer;