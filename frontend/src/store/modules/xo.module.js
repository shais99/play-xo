import xoService from '../../services/xo.service'
import socketService from '../../services/socketService'

export default {
    state: {
        games: [],
        currGame: null
    },
    getters: {
        games(state) {
            return state.games;
        },
        game(state) {
            return state.currGame
        }
    },
    mutations: {
        setGames(state, { games }) {
            state.games = games
        },
        removeBook(state, { id }) {
            const idx = state.books.findIndex(book => book._id === id);
            if (idx === -1) throw new Error('Somthing went wrong while deleting book');
            state.books.splice(idx, 1);
        },
        saveGame(state, { game }) {
            const idx = state.games.findIndex(currGame => game._id === currGame._id)
            if (idx === -1) state.games.unshift(game)
            else state.games.splice(idx, 1, game)
        },
        setGame(state, { game }) {
            state.currGame = game
        }
    },
    actions: {
        async loadGames({ commit }) {
            const games = await xoService.query()
            commit({ type: 'setGames', games })
            return games
        },
        async removeBook({ commit }, { id }) {
            await bookService.remove(id)
            commit({ type: 'removeBook', id })
        },
        async saveGame({ commit }, { game }) {
            const savedGame = await xoService.save(game)
            commit({ type: 'saveGame', game: savedGame })
            socketService.emit('updateGame', savedGame);
            return savedGame
        },
        async addGame({ commit }, { game }) {
            const savedGame = await xoService.save(game)
            commit({ type: 'saveGame', game: savedGame })
            return savedGame
        },
        async getGameById({ commit }, { id }) {
            const game = await xoService.get(id)
            commit({ type: 'setGame', game })
        },
        setGame({ commit }, { game }) {
            commit({ type: 'setGame', game })
        }
    }
}
