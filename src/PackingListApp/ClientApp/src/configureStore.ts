import { createStore, applyMiddleware, compose, combineReducers, Store } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { ApplicationState, configReducer } from "./stores/reducers";
import { History } from "history";
import { storeBuilder } from "redux-scaffolding-ts";
import { OccupationItemStore, OccupationItemsStore, NewOccupationItemStore } from "./stores/occupation-store";
import { NewUserItemStore, UserItemsStore, UserItemStore } from "./stores/user-store";

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === "undefined" ? null : (window as any);

    // If devTools is installed, connect to it
    const composeEnhancers =
        typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
                  latency: 0,
              })
            : compose;

    // define middlewares
    const middlewares = [thunk, routerMiddleware(history)];

    const createStoreWithMiddleware = composeEnhancers(applyMiddleware(...middlewares))(createStore);

    // Add repositories
    //storeBuilder.addRepository(new ServicesStore() as any);

    // Combine all reducers and instantiate the app-wide store instance
    const store = storeBuilder.getStore(initialState, buildRootReducer(), createStoreWithMiddleware as any) as Store<
        ApplicationState
    >;

    storeBuilder.addRepository(new OccupationItemStore() as any);
    storeBuilder.addRepository(new NewOccupationItemStore() as any);
    storeBuilder.addRepository(new OccupationItemsStore() as any);

    storeBuilder.addRepository(new UserItemStore() as any);
    storeBuilder.addRepository(new NewUserItemStore() as any);
    storeBuilder.addRepository(new UserItemsStore() as any);

    return store;
}

function buildRootReducer() {
    return combineReducers<ApplicationState>({ config: configReducer, router: routerReducer } as any);
}
