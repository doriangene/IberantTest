import React, { Component } from "react";
import { Layout, Input, Alert, Tooltip, Button } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    UserItemsStore,
    UserItem,
    AdminType
} from "src/stores/user-store";
import {
    TestItemsStore
} from "src/stores/test-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewUserItemView from "./body"

interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    newShow: boolean;
    editShow: boolean;
    selected: UserItem | null;
}

@connect(["UserItems", UserItemsStore])
export default class UserItemListPage extends Component<
    UserItemListProps,
    UserItemListState
> {
    private id: number = -1;
    private get UserItemsStore() {
        return (this.props as any).UserItems as UserItemsStore;
    }

    constructor(props: UserItemListProps) {
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
        this.getOccupations(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.UserItemsStore.getAllAsync(query);
    }

 
    private async getOccupations(query: Query) {
        await this.UserItemsStore.getAllAsync(query);
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
    private async onEditItem(data: UserItem) {
        this.setState({ editShow: true, selected: data })
    }

    @autobind
    private async onSaveItem(item: UserItem, state: ItemState) {
        var result = await this.UserItemsStore.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query);
        return result;
    }

    
    @autobind
    private async onRemoveItem(id: number) {
        var result = await this.UserItemsStore.deleteAsync(id);
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
        item: UserItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UserItemsStore.deleteAsync(`${item.id}`);
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
                    field: "name",
                    title: "Name",
                    renderer: data =>

                    <span>{data.name}</span>,

                    editor: data => <Input />


                },
                {
                    field: "lastname",
                    title: "Lastname",
                    renderer: data => <span>{data.lastname}</span>,
                    editor: data => <Input />
                },
                {
                    field: "address",
                    title: "Address",
                    renderer: data => <span>{data.address}</span>,
                    editor: data => <Input />
                },
                {
                    field: "isAdmin",
                    title: "Admin",
                    renderer: data => <span>{data.isAdmin ? 'Yes': 'No'}</span>,
                    editor: data => <Input />
                },
                {
                    field: "adminType",
                    title: "Admin Type",
                    renderer: data => <span>{data.isAdmin ? AdminType[data.adminType] : '-'}</span>,
                    editor: data => <Input />
                },

            ],
            data: this.UserItemsStore.state,
            sortFields: [


            ]
        } as TableModel<UserItem>;

        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    {this.UserItemsStore.state.result &&
                        !this.UserItemsStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                            description={this.UserItemsStore.state.result.messages
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
                        {this.state.newShow && <NewUserItemView onClose={this.onNewItemClosed} occupations={[]} />}
                        {this.state.editShow && <NewUserItemView item={this.state.selected} onClose={this.onEditItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
