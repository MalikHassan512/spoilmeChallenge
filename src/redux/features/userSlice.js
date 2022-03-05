import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userId: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUser: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const {changeUser} = userSlice.actions;
export const selectUser = state => state.user.userId;
export default userSlice.reducer;
