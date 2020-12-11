import React, { Component } from "react";
import { Layout, Input } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableColumn } from "../../components/collections/table";
import {
    UsersStore,
    User,
} from "src/stores/userStore";
import { connect } from "redux-scaffolding-ts";
import CrudTable from "../ListPage/CrudTable";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
const { Content } = Layout;

interface UserListProps extends RouteComponentProps {
    Store: UsersStore,
}


@connect(["Users", UsersStore])
export default class UserListPage extends Component<UserListProps> {

    render() {

        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    <CrudTable
                        Store={this.props.Store}
                        TableColumns={[
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
                        ] as TableColumn<User>[]}
                    />
                </Content>
            </Layout>
        );
    }
}