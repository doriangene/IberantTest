import { Alert } from "antd";
import autobind from "autobind-decorator";
import React, { Component, FC } from "react";
import {
    TableColumn,
    TableModel,
    TableView,
} from "../../components/collections/table";
import { DataStore, ItemState, Query } from "../../stores/dataStore";
import { FormStore } from "../../stores/formStore";
import NewItemView, { FormBodyProps } from "./NewItemView";

export interface CrudModel {
    id: number | string;
}

interface CrudTableProps<Item, NewItem> {
    DataStore: DataStore<Item>;
    CreationStore: FormStore<NewItem>;
    CreationFormBody:
        | Component<FormBodyProps<NewItem>>
        | FC<FormBodyProps<NewItem>>;
    TableColumns: Array<TableColumn<Item>>;
}

interface CrudTableState {
    query: Query;
    newShow: boolean;
}

/**
 * CrudTable is a generic component that implements Crud operations for a model using that model store.
 */
export default class CrudTable<T extends CrudModel, NewT> extends Component<
    CrudTableProps<T, NewT>,
    CrudTableState
> {
    private id: number = -1;

    constructor(props: CrudTableProps<T, NewT>) {
        super(props);

        this.state = {
            query: {
                searchQuery: "",
                orderBy: [
                    { field: "id", direction: "Ascending", useProfile: false },
                ],
                skip: 0,
                take: 10,
            },
            newShow: false,
        };
    }

    private get TableColumns() {
        return this.props.TableColumns;
    }

    private get DataStore() {
        return this.props.DataStore;
    }

    private get CreationStore() {
        return this.props.CreationStore;
    }

    private get CreationFormBody() {
        return this.props.CreationFormBody;
    }

    private get TableModel() {
        return {
            query: this.state.query,
            columns: this.TableColumns,
            data: this.DataStore.state,
            sortFields: [],
        } as TableModel<T>;
    }

    public componentWillMount() {
        this.load(this.state.query);
    }

    public render() {
        return (
            <>
                {this.DataStore.state.result &&
                    !this.DataStore.state.result.isSuccess && (
                        <Alert
                            type="error"
                            message={"Ha ocurrido un error"}
                            description={this.DataStore.state.result.messages
                                .map((o) => o.body)
                                .join(", ")}
                        />
                    )}
                <div style={{ margin: "12px" }}>
                    <TableView
                        rowKey={"id"}
                        model={this.TableModel}
                        onQueryChanged={(q: Query) => this.onQueryChanged(q)}
                        onNewItem={this.onNewItem}
                        onRefresh={() => this.load(this.state.query)}
                        canDelete={true}
                        canCreateNew={true}
                        onSaveRow={this.onSaveItem}
                        hidepagination={true}
                        canEdit={true}
                    />
                    {this.state.newShow && (
                        <NewItemView
                            onClose={this.onNewItemClosed}
                            CreationStore={this.CreationStore}
                            CreationFormBody={this.CreationFormBody}
                        />
                    )}
                </div>
            </>
        );
    }

    @autobind
    private async load(query: Query) {
        await this.DataStore.getAllAsync(query);
    }

    @autobind
    private onQueryChanged(query: Query) {
        this.setState({ query });
        this.load(query);
    }

    @autobind
    private async onNewItem() {
        this.setState({ newShow: true });
    }

    @autobind
    private async onSaveItem(item: T, state: ItemState) {
        let result = await this.DataStore.saveAsync(`${item.id}`, item, state);
        await this.load(this.state.query);
        return result;
    }

    @autobind
    private onNewItemClosed() {
        this.setState({ newShow: false });
        this.load(this.state.query);
    }
}
