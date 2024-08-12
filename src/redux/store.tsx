import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { combineReducers } from 'redux';
import { treeSlice, TreeState } from './slices/treeSlice';
import { propertySlice, PropertyState } from './slices/propertySlice';

export interface RootState {
  tree: TreeState;
  properties: PropertyState;
}

const logger = createLogger();

const rootReducer = combineReducers({
  tree: treeSlice.reducer,
  properties: propertySlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
