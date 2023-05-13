import HttpService from '../services/http-service';
import { AxiosResponse } from 'axios';
import { ReduxRepository } from 'redux-scaffolding-ts';
import { CommandResult, CommandModel, Message } from './types';
import { Container } from "inversify";
import autobind from 'autobind-decorator';
import { clone, delay } from '../utils/object';
import * as lakmus from 'lakmus';
import { createPatch } from 'rfc6902';

export interface FormModel<T> extends CommandModel<T> {
    status: 'New' | 'Unchanged' | 'Modified';
    item: T | undefined;
}

export abstract class FormStore<T> extends ReduxRepository<FormModel<T>> {
    public ENTITY_LOAD : string;
    public ENTITY_CREATED: string;
    public ENTITY_SAVE: string;
    public ENTITY_CHANGED: string;
    public ENTITY_VALIDATED: string;

    private _initialState: FormModel<T>;

    protected abstract get baseUrl(): string;

    protected abstract validate(item: T): lakmus.ValidationResult;
    private container: Container;

    constructor(entityName: string, initialState: FormModel<T>, container: Container) {
        super(initialState);
        this.container = container;
        this._initialState = clone(initialState);
        this.ENTITY_LOAD = `${entityName}_LOAD`;
        this.ENTITY_CREATED = `${entityName}_CREATED`;
        this.ENTITY_SAVE = `${entityName}_SAVE`;
        this.ENTITY_CHANGED = `${entityName}_CHANGED`;
        this.ENTITY_VALIDATED = `${entityName}_VALIDATED`;

        this.addReducer(this.ENTITY_CREATED, (item: T): FormModel<T> => ({
            isBusy: false,
            item: item || {} as T,
            status: 'New',
            result: undefined,
        }), 'Simple');

        //this.addReducer(this.ENTITY_LOAD, (): AsyncAction<AxiosResponse<T>, FormModel<T>> => {
        this.addReducer(this.ENTITY_LOAD, (): any => {
            return {
                onStart: (args: any) => ({ ...this.state, isBusy: true }),
                onSuccess: (value: any, args: any) => {
                    return {
                        ...this.state,
                        isBusy: false,
                        item: value.data,
                        status: 'Unchanged',
                        result: undefined
                    };
                },
                onError: (error: any, args: any) => ({
                    ...this.state, isBusy: false, result: error && error.response && error.response.data && error.response.data.messages ? error.response.data : {
                        isSuccess: false,
                        items: [],
                        messages: [{ body: error.message || error, level: 'Error' }]
                    }
                } as FormModel<T>)
            };
        }, 'AsyncAction');

        //this.addReducer(this.ENTITY_SAVE, (): AsyncAction<AxiosResponse<CommandResult<T>>, FormModel<T>> => {
        this.addReducer(this.ENTITY_SAVE, (): any => {
            return {
                onStart: () => ({ ...this.state, isBusy: true }),
                onSuccess: (value: any) => {
                    return {
                        ...this.state,
                        isBusy: false,
                        status: 'Unchanged',
                        result: value
                    };
                },
                onError: (error: any) => ({
                    ...this.state, isBusy: false, result: error && error.response && error.response.data && error.response.data.messages ? error.response.data : {
                        isSuccess: false,
                        items: [],
                        messages: [{ body: error.message || error, level: 'Error' }]
                    }
                } as FormModel<T>)
            };
        }, 'AsyncAction');

        this.addReducer(this.ENTITY_CHANGED, (item: Partial<T>): FormModel<T> => ({
            ...this.state,
            status: this.state.status === 'Unchanged' ? 'Modified' : this.state.status,
            item: Object.assign((this.state || {} as any).item || {}, item || {}) as any,
        }), 'Simple');
        this.addReducer(this.ENTITY_VALIDATED, (result: lakmus.ValidationResult): FormModel<T> => ({
            ...this.state,
            result: {
                isSuccess: false,
                items: [],
                messages: result.errors.map((o) => <Message> { propertyName: o.propertyName, body: o.errorMessage, level: 'Error' })
            },
        }), 'Simple');
    }

    public async getById(id: string, params?: any): Promise<T> {
        var httpService = this.container.get<HttpService>(HttpService);
        const result = await this.dispatchAsync(this.ENTITY_LOAD, httpService.get<T>(`${this.baseUrl}/${id}`, params));
        return result.data;
    }

    public clear() {
        this.dispatch(this.ENTITY_CHANGED, clone(this._initialState.item));
    }

    public createNew(item?: T) {
        this.dispatch(this.ENTITY_CREATED, item);
    }

    public change(partialItem?: Partial<T>) {
        this.dispatch(this.ENTITY_CHANGED, partialItem);
    }

    @autobind
    public async submit(): Promise<CommandResult<T>> {
        const validationResult = this.validate(this.state.item as T);
        if (!validationResult.isValid) {
            this.dispatch(this.ENTITY_VALIDATED, validationResult);
            return Promise.resolve({
                isSuccess: false,                
            } as CommandResult<T>);
        } else {
            var httpService = this.container.get<HttpService>(HttpService);
            var item = this.state.item;
            
            return await this.dispatchAsync(this.ENTITY_SAVE, new Promise<CommandResult<T>>((resolve, reject) => {
                httpService.post<T, CommandResult<T>>(`${this.baseUrl}`, item as T)
                    .then(async httpResult => {
                        var wait: boolean = true;
                        var ctx = 0;
                        var ms = 100;
                        do {
                            await delay(ms);
                            try {
                                var existsResult = await httpService.get(`${this.baseUrl}/${this.removeEmptyString(httpResult.data.identifier as string) || this.removeEmptyString(httpResult.data.aggregateRootId as string) || httpResult.data.title}`);
                                wait = existsResult.status == 404;
                                ctx++;
                            } catch (exception) {
                                wait = !exception || exception.status == 404
                                ctx++;
                            }
                            ms = ms * 2;
                        } while (wait && ctx < 8);
                        resolve(httpResult.data);
                    })
                    .catch(error => reject(error))
            }));
        }
    }

    private removeEmptyString(value: string) {
        if (value == "" || value == " ")
            return undefined;
        return value;
    }

    public patch(actionName: string, path: string, partial: Partial<T>) {
        var httpService = this.container.get<HttpService>(HttpService);
        return this.dispatchAsync(actionName, httpService.patch(`${this.baseUrl}/${path}`, createPatch(this.state.item, partial)), partial);
    }

    protected put(actionName: string, path: string, partial: Partial<T>) {
        var httpService = this.container.get<HttpService>(HttpService);
        return this.dispatchAsync(actionName, httpService.put(`${this.baseUrl}/${path}`, partial), partial);
    }

    protected onPatch(): any {
    //protected onPatch(): AsyncAction<AxiosResponse<CommandResult<T>>, FormModel<T>> {
        return {
            onStart: (args: any) => ({ ...this.state, isBusy: true }),
            onSuccess: (result: any, partial: Partial<T>) => {
                return {
                    ...this.state,
                    item: Object.assign((this.state || {} as any).item || {}, partial),
                    isBusy: false,
                    status: 'Unchanged',
                    result: result.data
                };
            },
            onError: (error: any, args: any) => ({
                ...this.state,
                isBusy: false,
                result: error && error.response && error.response.data && error.response.data.messages ? error.response.data : {
                    isSuccess: false,
                    items: [],
                    messages: [{ body: error.message || error, level: 'Error' }]
                }
            } as FormModel<T>)
        };
    }
}
