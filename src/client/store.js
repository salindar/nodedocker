/*
Salinda Rathnayeka
*/
import { createStore, combineReducers, applyMiddleware,compose } from 'redux'
import fileState from './reducers/fileReducer'
import thunk from 'redux-thunk'
const reducer = combineReducers({
    fileState
})
const middleware = applyMiddleware(thunk);
const store = createStore(
    reducer,
    compose(middleware, window.devToolsExtension ? window.devToolsExtension() : f => f)
)
export default store;