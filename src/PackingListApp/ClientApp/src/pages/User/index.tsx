import React, { Component } from "react";
import { Layout, Input, Alert } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { UsersStore, User } from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
const { Content } = Layout;
import NewUserView from "./body"

interface UserListProps extends RouteComponentProps { }

interface UserListState {
    query: Query;
    newShow: boolean;
}

@connect(["Users", UsersStore])
export default class UserListPage extends Component<
    UserListProps,
    UserListState
> {
    private get UsersStore() {
        return (this.props as any).Users as UsersStore;
    }

    constructor(props: UserListProps) {
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
        await this.UsersStore.getAllAsync(query);
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
    private async onSaveItem(item: User, state: ItemState) {
        var result = await this.UsersStore.saveAsync(
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
        item: User,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UsersStore.deleteAsync(`${item.id}`);
    }

    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "name",
                    title: "Name",
                    renderer: data => <span>{data.name}</span>,
                    editor: data => <Input />
                },
                {
                    field: "lastNames",
                    title: "Last Names",
                    renderer: data => <span>{data.lastNames}</span>,
                    editor: data => <Input />
                },
                {
                    field: "address",
                    title: "Address",
                    renderer: data => <span>{data.address}</span>,
                    editor: data => <Input />
                },
            ],
            data: this.UsersStore.state,
            sortFields: []
        } as TableModel<User>;

        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    {this.UsersStore.state.result &&
                        !this.UsersStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                                description={this.UsersStore.state.result.messages
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
                        />
                        {this.state.newShow && <NewUserView onClose={this.onNewItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}

