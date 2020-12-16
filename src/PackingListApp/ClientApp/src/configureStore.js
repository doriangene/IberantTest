"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var react_router_redux_1 = require("react-router-redux");
var reducers_1 = require("./stores/reducers");
var redux_scaffolding_ts_1 = require("redux-scaffolding-ts");
var test_store_1 = require("./stores/test-store");
var user_store_1 = require("./stores/user-store");
function configureStore(history, initialState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    var windowIfDefined = typeof window === "undefined" ? null : window;
    // If devTools is installed, connect to it
    var composeEnhancers = typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
            latency: 0,
        })
        : redux_1.compose;
    // define middlewares
    var middlewares = [redux_thunk_1.default, react_router_redux_1.routerMiddleware(history)];
    var createStoreWithMiddleware = composeEnhancers(redux_1.applyMiddleware.apply(void 0, middlewares))(redux_1.createStore);
    // Add repositories
    //storeBuilder.addRepository(new ServicesStore() as any);
    // Combine all reducers and instantiate the app-wide store instance
    var store = redux_scaffolding_ts_1.storeBuilder.getStore(initialState, buildRootReducer(), createStoreWithMiddleware);
    redux_scaffolding_ts_1.storeBuilder.addRepository(new test_store_1.TestItemStore());
    redux_scaffolding_ts_1.storeBuilder.addRepository(new test_store_1.NewTestItemStore());
    redux_scaffolding_ts_1.storeBuilder.addRepository(new test_store_1.TestItemsStore());
    redux_scaffolding_ts_1.storeBuilder.addRepository(new user_store_1.UserItemStore());
    redux_scaffolding_ts_1.storeBuilder.addRepository(new user_store_1.NewUserItemStore());
    redux_scaffolding_ts_1.storeBuilder.addRepository(new user_store_1.UserItemsStore());
    return store;
}
exports.default = configureStore;
function buildRootReducer() {
    return redux_1.combineReducers({ config: reducers_1.configReducer, router: react_router_redux_1.routerReducer });
}
//# sourceMappingURL=configureStore.js.map