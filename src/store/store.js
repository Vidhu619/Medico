import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import listReducer from "./listslice";
import searchReducer from "./searchslice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        list: listReducer,
        search: searchReducer,

    }
});
export default store;