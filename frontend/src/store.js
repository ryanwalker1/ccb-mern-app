import {createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {productReducers, productDetailsReducer,productReducer, newProductReducer} from './reducers/productReducers'
import {authReducer} from './reducers/userReducers'


const reducer = combineReducers({

    products: productReducers,
    product: productReducer,
    newProduct: newProductReducer,
    productDetails: productDetailsReducer,
    auth: authReducer
})

let initialState = {}


const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;