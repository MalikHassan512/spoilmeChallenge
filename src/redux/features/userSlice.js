import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  contactList:[],
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUser: (state, action) => {
      state.userId = action.payload;
    },
    contactList: (state, action) => {
      state.contactList = action.payload;
    },
  },
});

export const {changeUser,contactList} = userSlice.actions;
export const selectUser = state => state.user.userId;
export default userSlice.reducer;
