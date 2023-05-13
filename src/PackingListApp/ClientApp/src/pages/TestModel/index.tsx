import React, { Component } from "react";
import { Layout, Input, Alert, Button, Tooltip } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    TestItemsStore,
    TestItem
} from "src/stores/test-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewTestItemView from "./body"

interface TestItemListProps extends RouteComponentProps { }

interface TestItemListState {
    query: Query;
    newShow: boolean;
    editShow: boolean;
    selected: UserItem | null;
}

@connect(["TestItems", TestItemsStore])
export default class TestItemListPage extends Component<
TestItemListProps,
TestItemListState
> {
    private id: number = -1;
    private get TestItemsStore() {
        return (this.props as any).TestItems as TestItemsStore;
    }

    constructor(props: TestItemListProps) {
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
            newShow: false,
            editShow: false,
            selected: null
        };
    }

    componentWillMount() {

        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.TestItemsStore.getAllAsync(query);
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
    private async onSaveItem(item: TestItem, state: ItemState) {
        var result = await this.TestItemsStore.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query);
        return result;
    }

    @autobind
    private async onEditItem(data: TestItem) {
        this.setState({ editShow: true, selected: data })
    }

    @autobind
    private async onRemoveItem(id: number) {
        var result = await this.TestItemsStore.deleteAsync(id);
        await this.load(this.state.query);
        return result;
    }


    @autobind
    private onNewItemClosed() {
        this.setState({ newShow: false });
        this.load(this.state.query);
    }

    @autobind
    private onEditItemClosed() {
        this.setState({ editShow: false });
        this.load(this.state.query);
    } 


    @autobind
    private async onDeleteRow(
        item: TestItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.TestItemsStore.deleteAsync(`${item.id}`);
    }



    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "id",
                    title: "Actions",
                    renderer: data =>
                        <>
                            <Tooltip title="edit">
                                <Button shape="circle" type="primary" icon={'edit'} onClick={() => this.onEditItem(data)} />
                            </Tooltip>,
                            <Tooltip title="delete">
                                <Button shape="circle" type="danger" icon={'delete'} onClick={() => this.onRemoveItem(data.id)} />
                            </Tooltip>,
                        </>
                },
                {
                    field: "title",
                    title: "Title",
                    renderer: data =>

                    <span>{data.title}</span>,

                    editor: data => <Input />


                },
                {
                    field: "description",
                    title: "Description",
                    renderer: data => <span>{data.description}</span>,
                    editor: data => <Input />
                },


            ],
            data: this.TestItemsStore.state,
            sortFields: [


            ]
        } as TableModel<TestItem>;

        return (
            <Layout>
                <HeaderComponent title="TestModels" canGoBack={true} />

                <Content className="page-content">
                    {this.TestItemsStore.state.result &&
                        !this.TestItemsStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                                description={this.TestItemsStore.state.result.messages
                                    .map(o => o.body)
                                    .join(", ")}
                            />
                        )}

                    <div style={{ margin: "12px" }}>
                        <TableView
                            rowKey={"id"}
                            model={tableModel}
                            onQueryChanged={(q: Query) => this.onQueryChanged(q)}
                            onNewItem={this.onNewItem}
                            onRefresh={() => this.load(this.state.query)}
                            canDelete={false}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={false}
                        />
                        {this.state.newShow && <NewTestItemView onClose={this.onNewItemClosed} />}
                        {this.state.editShow && <NewTestItemView item={this.state.selected} onClose={this.onEditItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
