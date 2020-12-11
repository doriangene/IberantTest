import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col, Checkbox, Select, Radio, Modal } from "antd";
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

interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    newShow: boolean;
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
            newShow: false
        };
    }

    componentWillMount() {

        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
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
    private async onSaveItem(item: UserItem, state: ItemState) {
        console.log(item);
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
    private async onDeleteRow(
        item: UserItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UserItemsStore.deleteAsync(`${item.id}`);
    }



    render() {
        console.log(this.UserItemsStore.state.items);
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "name",
                    title: "Name",
                    renderer: data =>

                        <span>{data.name}</span>,

                    editor: data => <Input />


                },
                {
                    field: "lastName",
                    title: "Last Name",
                    renderer: data =>

                        <span>{data.lastName}</span>,

                    editor: data => <Input />


                },
                {
                    field: "description",
                    title: "Description",
                    renderer: data => <span>{data.description}</span>,
                    editor: data => <Input />
                },
                {
                    field: "adminType",
                    title: "Admin Type",
                    renderer: data => <span>{(data.adminType === "Normal" || data.adminType === "Vip" || data.adminType === "King") ? data.adminType : "Not an Admin"}</span>,
                    //editor: data => <Select />
                },


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
                            onDeleteRow={this.onDeleteRow}
                            canDelete={true}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={true}
                            onRowClick={(item, state) => alert()}
                        />
                        {this.state.newShow && <NewUserItemView onClose={this.onNewItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
