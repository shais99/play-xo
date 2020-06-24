let localLoggedinUser = null;
if (sessionStorage.user) localLoggedinUser = sessionStorage.user;

export default {
    state: {
        loggedInUser: localLoggedinUser
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser
        }
    },
    mutations: {
        setUser(state, { user }) {
            sessionStorage.setItem('user', user)
            state.loggedInUser = user
        }
    },
    actions: {
        setUser({ commit }, { user }) {
            commit({ type: 'setUser', user })
        }
    }
}
