import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './LoginSlice';

const Store = configureStore({
	reducer: {
		login: loginReducer,
	}
});

export default Store;