
import { combineReducers } from "@reduxjs/toolkit";
import { filterReducer } from "./slice/filter.slice";

export const rootReducers = combineReducers({
  filter: filterReducer,
});
