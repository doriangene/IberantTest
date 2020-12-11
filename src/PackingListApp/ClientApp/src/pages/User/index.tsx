import React, { Component, useEffect, useState } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { NewUserView } from "./body";
import {
    UsersStore,
    User,
} from "src/stores/userStore";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";

const { Content } = Layout;

interface UserListProps extends RouteComponentProps {
    Users: UsersStore,
}

interface UserListState {
    query: Query;
    newShow: boolean;
}

@connect(["Users", UsersStore])
export default class UserListPage extends Component<
UserListProps,
UserListState
> {
    private id: number = -1;
    private get UsersStore() {
        return this.props.Users;
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


    render() {

        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "firstName",
                    title: "First Name",
                    renderer: data =>
                        <span>{data.firstName}</span>,
                    editor: data => <Input />
                },
                {
                    field: "lastName",
                    title: "Last Name",
                    renderer: data => <span>{data.lastName}</span>,
                    editor: data => <Input />
                },
                {
                    field: "address",
                    title: "Address",
                    renderer: data => <span>{data.address}</span>,
                    editor: data => <Input />
                }
            ],
            data: this.UsersStore.state,
            sortFields: []
        } as TableModel<User>;

        return (
            <Layout>
                <HeaderComponent title="UserModels" canGoBack={true} />

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





// 
//const UsersListPage = (props: UserListProps) => {
//    const [state, setState] = useState(initialState);
//    const { usersStore } = props;

//    const load = async (query: Query) => {
//        await usersStore.getAllAsync(query);
//    }

//    const onQueryChanged = (query: Query) => {
//        setState({ ...state, query });
//        load(query);
//    }

//    const onNewItem = () => {
//        setState({ ...state, newShow: true });
//    }

//    // si luego cambio el estado del componente cambiar itemState por state 
//    const onSaveItem = async (item: User, itemState: ItemState) => {
//        const result = await usersStore.saveAsync(
//            `${item.id}`,
//            item,
//            itemState
//        );
//        await load(state.query);
//        return result;
//    }

//    //const onItemClosed = () => {
//    //    setState({ ...state, newShow: false });
//    //    load(state.query);
//    //}


//    useEffect(() => {
//        load(state.query)
//    }, [])




//    const tableModel = {
//        query: state.query,
//        columns: [
//            {
//                field: "firstName",
//                title: "First Name",
//                renderer: data =>
//                    <span>{data.firstName}</span>,
//                editor: data => <Input />
//            },
//            {
//                field: "lastName",
//                title: "Last Name",
//                renderer: data => <span>{data.lastName}</span>,
//                editor: data => <Input />
//            },
//            {
//                field: "address",
//                title: "Address",
//                renderer: data => <span>{data.address}</span>,
//                editor: data => <Input />
//            }
//        ],
//        data: usersStore.state,
//        sortFields: [

//        ]
//    } as TableModel<User>;
//
//
//    return (
//        <Layout>
//            <HeaderComponent title="Users" canGoBack={true} />
//
//            <Content className="page-content">
//                {usersStore.state.result &&
//                    !usersStore.state.result.isSuccess && (
//                        <Alert
//                            type="error"
//                            message={"Ha ocurrido un error"}
//                            description={usersStore.state.result.messages
//                                .map(o => o.body)
//                                .join(", ")}
//                        />
//                    )}

//                <div style={{ margin: "12px" }}>
//                    <TableView
//                        rowKey={"id"}
//                        model={tableModel}
//                        onQueryChanged={(q: Query) => onQueryChanged(q)}
//                        onNewItem={onNewItem}
//                        onRefresh={() => load(state.query)}
//                        canDelete={false}
//                        canCreateNew={true}
//                        onSaveRow={onSaveItem}
//                        hidepagination={true}
//                        canEdit={true}
//                    />
//                    {state.newShow && <NewUserView />}
//                </div>
//            </Content>
//        </Layout>
//    )
//}
