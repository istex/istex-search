import { createSlice } from '@reduxjs/toolkit';
import { istexApiConfig } from '../config';

export function getDefaultState () {
  return {
    queryString: '',
    qId: '',
    selectedFormats: 0,
    numberOfDocuments: 0,
    rankingMode: istexApiConfig.rankingModes.getDefault().value,
    compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
    archiveType: istexApiConfig.archiveTypes.getDefault().value,
    usage: '',
  };
}

export const istexApiSlice = createSlice({
  name: 'istexApi',
  initialState: getDefaultState(),
  reducers: {
    setQueryString: (state, action) => {
      state.queryString = action.payload;
    },
    setQId: (state, action) => {
      state.qId = action.payload;
    },
    setSelectedFormats: (state, action) => {
      state.selectedFormats = action.payload;
    },
    setNumberOfDocuments: (state, action) => {
      state.numberOfDocuments = action.payload;
    },
    setRankingMode: (state, action) => {
      state.rankingMode = action.payload;
    },
    setCompressionLevel: (state, action) => {
      state.compressionLevel = action.payload;
    },
    setArchiveType: (state, action) => {
      state.archiveType = action.payload;
    },
    setUsage: (state, action) => {
      state.usage = action.payload;
    },
  },
});

export const {
  setQueryString,
  setQId,
  setSelectedFormats,
  setNumberOfDocuments,
  setRankingMode,
  setCompressionLevel,
  setArchiveType,
  setUsage,
} = istexApiSlice.actions;

export default istexApiSlice.reducer;
