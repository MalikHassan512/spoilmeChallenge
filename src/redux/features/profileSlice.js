import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentProfileUser: null,
};
export const userSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    currentProfileUser: (state, action) => {
      state.currentProfileUser = action.payload
    }
  },
});

export const {currentProfileUser} = userSlice.actions;
export default userSlice.reducer;
