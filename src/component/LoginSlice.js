import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("authToken");
const storedUser = localStorage.getItem("userId");
const storedNick = localStorage.getItem("nick");

const initState = {
	isAuthenticated: !!storedToken, // 토큰이 존재하면 true
	user: storedUser || null,
	nick: storedNick || null,
	role: null,
	token: storedToken || null,
};

const loginSlice = createSlice({
	name: 'login',
	initialState: initState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.nick = action.payload.nick;
			state.role = action.payload.role;
			state.token = action.payload.token;
			localStorage.setItem("authToken", action.payload.token);
			localStorage.setItem("userId", action.payload.user);
			localStorage.setItem("nick", action.payload.nick);
		},
		logoutSuccess: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			state.nick = null;
			state.role = null;
			state.token = null;
			localStorage.removeItem("authToken");
			localStorage.removeItem("userId");
			localStorage.removeItem("nick");
		}
	}
});

export const { loginSuccess, logoutSuccess } = loginSlice.actions;
export default loginSlice.reducer;
