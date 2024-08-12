import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Property {
  [key: string]: string | number | boolean;
}

export interface PropertyState {
  generalProperties: { [key: string]: Property };
  additionalProperties: { [key: string]: Property };
}

const initialPropertyState: PropertyState = {
  generalProperties: {},
  additionalProperties: {},
};

export const propertySlice = createSlice({
  name: 'properties',
  initialState: initialPropertyState,
  reducers: {
    updateGeneralProperty: (
      state,
      action: PayloadAction<{
        nodeId: string;
        key: string;
        value: string | number | boolean;
      }>
    ) => {
      const { nodeId, key, value } = action.payload;
      if (!state.generalProperties[nodeId])
        state.generalProperties[nodeId] = {};
      state.generalProperties[nodeId][key] = value;
    },
    updateAdditionalProperty: (
      state,
      action: PayloadAction<{
        nodeId: string;
        key: string;
        value: string | number | boolean;
      }>
    ) => {
      const { nodeId, key, value } = action.payload;
      if (!state.additionalProperties[nodeId])
        state.additionalProperties[nodeId] = {};
      state.additionalProperties[nodeId][key] = value;
    },
    setProperties: (
      state,
      action: PayloadAction<{
        generalProperties: { [key: string]: Property };
        additionalProperties: { [key: string]: Property };
      }>
    ) => {
      state.generalProperties = action.payload.generalProperties || {};
      state.additionalProperties = action.payload.additionalProperties || {};
    },
    deleteGeneralProperty: (
      state,
      action: PayloadAction<{ nodeId: string; key: string }>
    ) => {
      const { nodeId, key } = action.payload;
      if (state.generalProperties[nodeId]) {
        delete state.generalProperties[nodeId][key];
      }
    },
    deleteAdditionalProperty: (
      state,
      action: PayloadAction<{ nodeId: string; key: string }>
    ) => {
      const { nodeId, key } = action.payload;
      if (state.additionalProperties[nodeId]) {
        delete state.additionalProperties[nodeId][key];
      }
    },
  },
});
