import HttpService from "../services/http-service";
import { AxiosResponse } from "axios";
import { ReduxRepository, AsyncAction } from "redux-scaffolding-ts";
import { CommandModel, Message, CommandResult } from "./types";
import { Container } from "inversify";
import * as buildQuery from "odata-query";
import { createPatch } from "rfc6902";

export interface DefaultMetadata {
    modifiedOn: Date;
    modifiedById: string;
    modifiedByName: string;
}

export type SortDirection = "Ascending" | "Descending";

export interface OrderDefinition {
    field: string;
    direction: SortDirection;
    useProfile: boolean;
}

export interface QueryParameters {
    [key: string]: string | string[];
}

export interface SortProfile {
    profile: string;
    direction: SortDirection;
}

export interface Query {
    searchQuery: string;
    orderBy?: OrderDefinition[];
    skip: number;
    take: number;
    parameters?: QueryParameters;
    filter?: object;
}

export interface QueryResult<T> {
    count: number;
    items: T[];
}

export interface QueryActions {
    load: (query: Query) => void;
}

export interface QueryState<T> {
    isBusy: boolean;
    data: QueryResult<T>;
}

export interface ItemIdentity {
    id: string;
}

export interface ItemReference extends ItemIdentity {
    title: string;
}

export interface ItemCommandResult {
    isSuccess: boolean;
    messages: Message[];
    item: ItemReference;
}

export type ItemState = "Unchanged" | "New" | "Changed";

export interface ItemModel<T> {
    state: ItemState;
    isBusy: boolean;
    item: T;
    result: ItemCommandResult | undefined;
}

export interface DataModel<T> extends CommandModel<T> {
    items: ItemModel<T>[];
    count: number;
    discard: (item: T) => void;
}

export abstract class DataStore<T extends any> extends ReduxRepository<
    DataModel<T>
    > {
    public ENTITY_LIST_UPDATE: string | undefined = undefined;
    public ENTITY_DELETED: string | undefined = undefined;
    public ENTITY_UPDATED: string | undefined = undefined;
    public ENTITY_CREATED: string | undefined = undefined;
    public DOWNLOADFILE: string | undefined = undefined;

    protected abstract get baseUrl(): string;
    protected get rowKey(): string {
        return "id";
    }
    protected get useTitleKey(): boolean {
        return false;
    }
    private container: Container;

    public get isDirty() {
        if (!this.state.items || this.state.items.length == 0) return false;
        return this.state.items.any(o => o.state != "Unchanged");
    }

    constructor(
        entityName: string,
        initialState: DataModel<T>,
        container: Container
    ) {
        super(initialState);
        this.container = container;
        this.ENTITY_LIST_UPDATE = `${entityName}_LIST_UPDATE`;
        this.ENTITY_DELETED = `${entityName}_DELETED`;
        this.ENTITY_CREATED = `${entityName}_CREATED`;
        this.ENTITY_UPDATED = `${entityName}_UPDATED`;

        //this.addReducer(this.ENTITY_LIST_UPDATE, (): AsyncAction<AxiosResponse<QueryResult<T>>, DataModel<T>> =>
        this.addReducer(
            this.ENTITY_LIST_UPDATE,
            (): any => {
                return {
                    onStart: () => ({ ...this.state, isBusy: true }),
                    onSuccess: (value: any) => {
                        console.log(value.data);
                        return {
                            ...this.state,
                            isBusy: false,
                            count: value.data.count,
                            result: undefined,
                            items: (value.data.items || []).map(
                                (item: any) =>
                                    ({
                                        state: "Unchanged",
                                        isBusy: false,
                                        item,
                                        result: undefined
                                    } as ItemModel<T>)
                            )
                        };
                    },
                    onError: (error: any) => ({
                        ...this.state,
                        isBusy: false,
                        result:
                            error &&
                                error.response &&
                                error.response.data &&
                                error.response.data.messages
                                ? error.response.data
                                : {
                                    isSuccess: false,
                                    items: [],
                                    count: 0,
                                    messages: [{ body: error.message || error, level: "Error" }]
                                }
                    })
                };
            },
            "AsyncAction"
        );
        this.addReducer(
            this.ENTITY_CREATED,
            (): any => {
                return {
                    onStart: () => ({ ...this.state, isBusy: true }),
                    onSuccess: (value: any) => {
                        return {
                            ...this.state,
                            isBusy: false,
                            count: this.state.count + 1,
                            result: undefined,
                            items: [
                                {
                                    isBusy: false,
                                    item: value,
                                    result: undefined,
                                    state: "New"
                                }
                            ].concat((this.state.items as any) || [])
                        };
                    },
                    onError: (error: any) => ({
                        ...this.state,
                        isBusy: false,
                        result:
                            error &&
                                error.response &&
                                error.response.data &&
                                error.response.data.messages
                                ? error.response.data
                                : {
                                    isSuccess: false,
                                    items: this.state.items,
                                    count: this.state.count,
                                    messages: [{ body: error.message || error, level: "Error" }]
                                }
                    })
                };
            },
            "AsyncAction"
        );
        this.addReducer(
            this.ENTITY_UPDATED as string,
            (): any => {
                return {
                    onStart: () => ({ ...this.state, isBusy: true }),
                    onSuccess: (result: any, item: any) => {
                        return {
                            ...this.state,
                            items: this.state.items.map(o => {
                                if (
                                    (o.item as any)[this.rowKey] as any ==
                                    (item[this.rowKey as any] as any ||
                                        result.data.identifier ||
                                        (this.useTitleKey
                                            ? result.data.title
                                            : result.data.aggregateRootId ||
                                            result.data.correlationId))
                                ) {
                                    o.state = "Unchanged";
                                    o.item = Object.assign(o.item, item);
                                    (o.item as any)[this.rowKey as any] =
                                        result.data.identifier || (o.item as any)[this.rowKey];
                                }
                                return o;
                            }),
                            isBusy: false
                        };
                    },
                    onError: (error: any) => ({
                        ...this.state,
                        isBusy: false,
                        result:
                            error &&
                                error.response &&
                                error.response.data &&
                                error.response.data.messages
                                ? error.response.data
                                : {
                                    isSuccess: false,
                                    items: this.state.items,
                                    count: this.state.count,
                                    messages: [{ body: error.message || error, level: "Error" }]
                                }
                    })
                };
            },
            "AsyncAction"
        );
        this.addReducer(
            this.ENTITY_DELETED,
            (): any => {
                return {
                    onStart: () => ({ ...this.state, isBusy: true }),
                    onSuccess: (value: any) => {
                        return {
                            ...this.state,
                            isBusy: false,
                            count: value.data.count - 1,
                            result: undefined,
                            items: this.state.items.filter(
                                o =>
                                    (o.item as any)[this.rowKey] !=
                                    (value.data.identifier ||
                                        (this.useTitleKey
                                            ? value.data.title
                                            : value.data.aggregateRootId || value.data.correlationId))
                            )
                        };
                    },
                    onError: (error: any) => ({
                        ...this.state,
                        isBusy: false,
                        result:
                            error &&
                                error.response &&
                                error.response.data &&
                                error.response.data.messages
                                ? error.response.data
                                : {
                                    isSuccess: false,
                                    items: [],
                                    count: 0,
                                    messages: [{ body: error.message || error, level: "Error" }]
                                }
                    })
                };
            },
            "AsyncAction"
        );
    }

    public static buildUrl(query: Query) {
        const parts = [];
        if (query.searchQuery) {
            parts.push(`$search=${query.searchQuery}`);
        }

        var oDataQuery = {
            skip: query.skip || 0,
            top: query.take || 10
        } as any;

        if (query.orderBy && query.orderBy.length > 0) {
            var sortProfile = query.orderBy.filter(o => o.useProfile);
            if (sortProfile.length > 0) {
                parts.push(
                    `sortProfile=${sortProfile[0].field} ${sortProfile[0].direction}`
                );
            } else {
                var order = [];
                for (var i = 0; i < query.orderBy.length; i++) {
                    let direction =
                        query.orderBy[i].direction == "Ascending" ? "asc" : "desc";
                    order.push(`${query.orderBy[i].field} ${direction}`);
                }
                oDataQuery["orderBy"] = order;
            }
        }

        if (query.filter) {
            oDataQuery["filter"] = query.filter;
        }

        parts.push(buildQuery.default(oDataQuery).substr(1));

        if (query.parameters) {
            for (var prop in query.parameters as any) {
                if (
                    query.parameters[prop] &&
                    query.parameters[prop].constructor === Array
                ) {
                    for (var idx = 0; idx < query.parameters[prop].length; idx++) {
                        if (query.parameters[prop][idx])
                            parts.push(
                                `${prop}=${encodeURIComponent(query.parameters[prop][idx])}`
                            );
                    }
                } else {
                    if (query.parameters[prop])
                        parts.push(
                            `${prop}=${encodeURIComponent(query.parameters[prop] as string)}`
                        );
                }
            }
        }
        return parts.join("&");
    }

    public async getAllAsync(query: Query, data?: any): Promise<QueryResult<T>> {
        let httpService = this.container.get<HttpService>(HttpService);
        const result = await this.dispatchAsync(
            this.ENTITY_LIST_UPDATE as string,
            httpService.get<QueryResult<T>>(
                `${this.baseUrl}?${DataStore.buildUrl(query)}`,
                data
            )
        );
        console.log(result.data);
        return result.data;
    }

    public async exportToExcel(query: Query, data?: any) {

        window.open(`${this.baseUrl}/export/excel?${DataStore.buildUrl(
            query
        )}&access_token=${HttpService.accessToken}`, "_blank")
    }

    public async deleteAsync(
        id: string,
        params?: any
    ): Promise<CommandResult<T>> {
        var item = this.state.items.firstOrDefault(o => (o.item as any)[this.rowKey] == id);
        if (item && item.state == "New") {
            var data = {
                aggregateRootId: id,
                identifier: id,
                isSuccess: true,
                items: [],
                messages: [],
                title: id
            } as CommandResult<T>;
            var result = ({
                status: 200,
                data: data
            } as unknown) as AxiosResponse<CommandResult<T>>;
            await this.dispatchAsync(
                this.ENTITY_DELETED as string,
                Promise.resolve(result),
                result
            );
            return data;
        } else {
            let httpService = this.container.get<HttpService>(HttpService);
            const result = await this.dispatchAsync(
                this.ENTITY_DELETED as string,
                httpService.delete<any, CommandResult<T>>(
                    `${this.baseUrl}/${encodeURIComponent(id)}`,
                    params
                )
            );
            return result.data;
        }
    }

    public async saveAsync(key: string, item: T, state: ItemState) {
        var httpService = this.container.get<HttpService>(HttpService);
        let result: AxiosResponse<any> | undefined = undefined;
        if (state == "New") {
            result = await this.dispatchAsync(
                this.ENTITY_UPDATED as string,
                httpService.post(`${this.baseUrl}`, item),
                item
            );
        } else {
            result = await this.dispatchAsync(
                this.ENTITY_UPDATED as string,
                httpService.put(`${this.baseUrl}/${encodeURIComponent(key)}`, item),
                item
            );
        }
        if (result) return result.data;
        return null;
    }

    public createAsync(partial: Partial<T>) {
        return this.dispatchAsync(
            this.ENTITY_CREATED as string,
            Promise.resolve(partial),
            partial
        );
    }

    protected patch(actionName: string, path: string, partial: Partial<T>) {
        var httpService = this.container.get<HttpService>(HttpService);
        var item = this.state.items.firstOrDefault(
            o => (o.item as any)[this.rowKey] == path
        );
        if (item) {
            return this.dispatchAsync(
                actionName,
                httpService.patch(
                    `${this.baseUrl}/${encodeURIComponent(path)}`,
                    createPatch(item, partial)
                ),
                partial
            );
        }
        return this.dispatchAsync(
            actionName,
            httpService.put(`${this.baseUrl}/${encodeURIComponent(path)}`, partial),
            partial
        );
    }

    protected onPatch(key?: string): any {
        //protected onPatch(): AsyncAction<AxiosResponse<CommandResult<T>>, FormModel<T>> {
        if (!key) key = "id";
        return {
            onStart: (args: any) => ({ ...this.state, isBusy: true }),
            onSuccess: (result: any, partial: Partial<T>) => {
                var items = (this.state || ({} as any)).items.map(o => {
                    if ((o.item as any)[key as string] == (partial as any)[key as string]) {
                        o.item = Object.assign(o.item, partial);
                        return o;
                    }
                    return o;
                });
                return {
                    ...this.state,
                    items: items,
                    isBusy: false,
                    status: "Unchanged",
                    result: result.data
                } as DataModel<T>;
            },
            onError: (error: any, args: any) =>
                ({
                    ...this.state,
                    isBusy: false,
                    result:
                        error &&
                            error.response &&
                            error.response.data &&
                            error.response.data.messages
                            ? error.response.data
                            : {
                                isSuccess: false,
                                items: [],
                                messages: [{ body: error.message || error, level: "Error" }]
                            }
                } as DataModel<T>)
        };
    }
}
