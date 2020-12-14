import { Input, Layout } from "antd";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "redux-scaffolding-ts";
import { NewUserStore, User, UsersStore } from "src/stores/userStore";
import { TableColumn } from "../../components/collections/table";
import HeaderComponent from "../../components/shell/header";
import CrudTable from "../common/CrudTable";
import UserFormBody from "./body";
const { Content } = Layout;

interface UserListProps extends RouteComponentProps {
    DataStore: UsersStore;
    CreationStore: NewUserStore;
}

@connect(["CreationStore", NewUserStore])
@connect(["DataStore", UsersStore])
export default class UserListPage extends Component<UserListProps> {
    public render() {
        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    <CrudTable
                        DataStore={this.props.DataStore}
                        CreationStore={this.props.CreationStore}
                        CreationFormBody={UserFormBody}
                        TableColumns={
                            [
                                {
                                    field: "firstName",
                                    title: "First Name",
                                    renderer: (data) => (
                                        <span>{data.firstName}</span>
                                    ),
                                    editor: (data) => <Input />,
                                },
                                {
                                    field: "lastName",
                                    title: "Last Name",
                                    renderer: (data) => (
                                        <span>{data.lastName}</span>
                                    ),
                                    editor: (data) => <Input />,
                                },
                                {
                                    field: "address",
                                    title: "Address",
                                    renderer: (data) => (
                                        <span>{data.address}</span>
                                    ),
                                    editor: (data) => <Input />,
                                },
                            ] as Array<TableColumn<User>>
                        }
                    />
                </Content>
            </Layout>
        );
    }
}
