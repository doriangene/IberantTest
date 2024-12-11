import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    UserItemsStore,
    UserItem
} from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewUserItemView from "./body"
import { OccupationItemsStore } from "src/stores/occupation-store";

interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    newShow: boolean;
    updateShow: boolean;
}

@connect(["UserItems", UserItemsStore])
@connect(["OccupationItems", OccupationItemsStore])
export default class UserItemListPage extends Component<
    UserItemListProps,
    UserItemListState
> {
    private id: number = -1;
    private get UserItemsStore() {
        return (this.props as any).UserItems as UserItemsStore;
    }

    // OccupationItemsStore
    private get OccupationItemsStore() {
        return (this.props as any).OccupationItems as OccupationItemsStore;
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
            updateShow: false
        };
    }

    componentWillMount() {

        this.loadOccupations(this.state.query);
        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        const items = await this.UserItemsStore.getAllAsync(query);
        console.log("Items")
        console.log(items)
    }

    // OccupationItemsStore
    @autobind
    private async loadOccupations(query: Query) {
        await this.OccupationItemsStore.getAllAsync(query);
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
    private async onUpdateItem() {
        this.setState({ updateShow: true })
    }


    @autobind
    private async onSaveItem(item: UserItem, state: ItemState) {
        console.log("Saving Item...")
        var result = await this.UserItemsStore.saveAsync(
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

    @autobind
    private onUpdateItemClosed() {
        this.setState({ updateShow: false });
        this.load(this.state.query);
    }

    @autobind
    private async onDeleteRow(
        item: UserItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        const result = await this.UserItemsStore.deleteAsync(`${item.id}`);
        this.load(this.state.query);
        return result
    }



    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "firstName",
                    title: "FirstName",
                    renderer: data =>

                        <span>{data.firstName}</span>,

                    editor: data => <Input />


                },
                {
                    field: "lastName",
                    title: "FirstName",
                    renderer: data =>

                        <span>{data.lastName}</span>,

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
                    title: "IsAdmin",
                    renderer: data => <span>{data.isAdmin.toString()}</span>,
                    editor: data => <Input />
                },
                {
                    field: "AdminType",
                    title: "AdminType",
                    renderer: data => <span>{data.adminType == 0 ? "Normal" : data.adminType == 1 ? "Vip" : data.adminType == 2 ? "King" : "None"}</span>,
                    editor: data => <Input />
                },
                {
                    field: "Occupation",
                    title: "Occupation",
                    renderer: data => <span>{data.occupation ? data.occupation?.title : this.OccupationItemsStore.state.items.find(item => item.item.id == data.occupationId)?.item.title}</span>,
                    editor: data => <Input />
                }

            ],
            data: this.UserItemsStore.state,
            sortFields: [


            ]
        } as TableModel<UserItem>;

        return (
            <Layout>
                <HeaderComponent title="UserModels" canGoBack={true} />

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
                            canDelete={true}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={true}
                            onDeleteRow={this.onDeleteRow}
                        />
                        {this.state.newShow && <NewUserItemView onClose={this.onNewItemClosed} occupationData={this.OccupationItemsStore.state} />}
                        {/* {this.state.updateShow && <UpdateUserItemView onClose={this.onUpdateItemClosed} occupationData={this.OccupationItemsStore.state} />} */}
                    </div>
                </Content>
            </Layout>
        );
    }
}
