import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './Reducers'
import { connectionMiddleware } from './Middlewares/connectionMiddleware'
import { soundMiddleware } from './Middlewares/soundMiddleware';

const middleware = [thunk, soundMiddleware, connectionMiddleware];

export const store = createStore(
    rootReducer,
    undefined,
    compose(
        applyMiddleware(...middleware),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);