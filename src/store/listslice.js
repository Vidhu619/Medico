import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
    name: 'list',
    initialState: [],

    reducers: {
        setlist: (state, action) => { return action.payload },
        dellist:(state, action) => {
            const deletedItemId = action.payload;
            return state.filter(item => item.id !== deletedItemId);
          }
    }
})

export const { setlist, dellist } = listSlice.actions;
export default listSlice.reducer;