import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import profileReducer from './features/profileSlice';
import Storage from '@react-native-community/async-storage'
import { combineReducers } from 'redux';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage:Storage,
  blacklist: ['profile']
};

const reducers = combineReducers({
  user: userReducer,
  profile: profileReducer
});
export const store = configureStore({
  reducer:persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

export const persistor = persistStore(store)

