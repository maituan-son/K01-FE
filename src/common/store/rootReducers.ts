import { combineReducers } from "@reduxjs/toolkit";
import {filterReducer} from "./slice/filter.slice";


const rootReducer = combineReducers({
  filter: filterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
