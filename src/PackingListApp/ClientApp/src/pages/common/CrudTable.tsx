import React, { Component } from "react";
import { Input, Alert, Row, Col } from "antd";
import { TableColumn, TableModel, TableView } from "../../components/collections/table";
import { Query, ItemState, DataStore } from "../../stores/dataStore";
import autobind from "autobind-decorator";


interface CrudModel {
    id: number,
}

interface CrudTableProps<T> {
    Store: DataStore<T>,
    TableColumns: TableColumn<T>[],
}

interface CrudTableState {
    query: Query;
    newShow: boolean;
}

/**
 * CrudTable is a generic component that implements Crud operations for a model using that model store.
 */
export default class CrudTable<T extends CrudModel> extends Component<CrudTableProps<T>, CrudTableState> {
    private id: number = -1;

    private get TableColumns() {
        return this.props.TableColumns;
    }

    private get Store() {
        return this.props.Store;
    }

    private get TableModel() {
        return {
            query: this.state.query,
            columns: this.TableColumns,
            data: this.Store.state,
            sortFields: []
        } as TableModel<T>;
    }

    constructor(props: CrudTableProps<T>) {
        super(props);

        this.state = {
            query: {
                searchQuery: "",
                orderBy: [
                    { field: "id", direction: "Ascending", useProfile: false }
                ],
                skip: 0,
                take: 10
            },
            newShow: false
        };
    }

    componentWillMount() {
        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.Store.getAllAsync(query);
    }

    @autobind
    private onQueryChanged(query: Query) {
        this.setState({ query });
        this.load(query);
    }


    @autobind
    private async onNewItem() {
        this.setState({ newShow: true })
    }


    @autobind
    private async onSaveItem(item: T, state: ItemState) {
        var result = await this.Store.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query);
        return result;
    }

    @autobind
    private onNewItemClosed() {
        this.setState({ newShow: false });
        this.load(this.state.query);
    }


    render() {
        return (
            <>
                {this.Store.state.result &&
                    !this.Store.state.result.isSuccess && (
                        <Alert
                            type="error"
                            message={"Ha ocurrido un error"}
                            description={this.Store.state.result.messages
                                .map(o => o.body)
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
                    {/* {this.state.newShow && <NewTestItemView onClose={this.onNewItemClosed} />} */}
                </div>
            </>
        );
    }

}
