import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = new Vuex.Store({
	state: {
		user: null,
		loggedIn: false,
		loading: true,
		themeDark: localStorage.getItem("theme") == "dark"
	},
	mutations: {
		setUser(state, user){
			state.user = user;
		},
		setLoggedIn(state, loggedIn){
			state.loggedIn = loggedIn;
		},
		setLoading(state, loading){
			setTimeout(() => {state.loading = loading}, 500);
		},
		setTheme(state, theme){
			state.themeDark = theme == "dark";
			localStorage.setItem("theme", theme);
		}
	}
})

module.exports = store;