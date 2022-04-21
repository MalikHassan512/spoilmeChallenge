import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
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
};

const reducers = combineReducers({
  user: userReducer,
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

