import { fromJS } from 'immutable';
import { ActionCreator, Action } from 'redux';
import * as Axios from "axios";

const configInitialState = fromJS({ serviceUrl: null });

export interface AppConfig {
    serviceUrl: string
}

export interface ApplicationState {
    router: any,
    config: AppConfig,
}

interface AppInitialized extends Action {
    type: '@@app/INITIALIZED';
    payload: {
        config: AppConfig
    };
}

interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

export const initialize: ActionCreator<AppThunkAction<AppInitialized>> = () => (dispatch, getState) => {
    return async () => {
        const http = Axios.default.create({
            timeout: 30000,
        });
        const result = await http.get("api/v1/config");

        dispatch({
            type: '@@app/INITIALIZED',
            payload: {
                config: result.data,
            },
        });
    }
}

export function configReducer(state = configInitialState, action: any) {
    switch (action.type) {
        case '@@app/INITIALIZED':
            return {
                ...state,
                serviceUrl: action.payload.config.serviceUrl
            };
        default:
            return state;
    }
}