import { Input, Layout, Select } from 'antd';
import React, { Component, FC, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'redux-scaffolding-ts';
import {
    AdminType,
    NewUser,
    NewUserStore,
    User,
    UsersStore
} from 'src/stores/userStore';
import { TableColumn } from '../../components/collections/table';
import BooleanInput from '../../components/form/booleanInput';
import HeaderComponent from '../../components/shell/header';
import { DataStore } from '../../stores/dataStore';
import CrudTable from '../common/CrudTable';
import UserFormBody from './body';
import AdminTypeSelect from './forms/AdminTypeSelect';
const { Content } = Layout;

interface UserListProps extends RouteComponentProps {
    DataStore: UsersStore;
    CreationStore: NewUserStore;
}

@connect(['CreationStore', NewUserStore])
@connect(['DataStore', UsersStore])
export default class UserListPage extends Component<UserListProps> {
    public render() {
        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />
                <PageContent {...this.props} />
            </Layout>
        );
    }
}

// Only for handling state. I don't like to handle
// state in class based components.
const PageContent: FC<UserListProps> = props => {
    const { CreationStore, DataStore } = props;

    return (
        <Content className="page-content">
            <CrudTable
                DataStore={DataStore}
                CreationStore={CreationStore}
                CreationFormBody={UserFormBody}
                TableColumns={
                    [
                        {
                            field: 'firstName',
                            title: 'First Name',
                            renderer: data => <span>{data.firstName}</span>,
                            editor: data => <Input />
                        },
                        {
                            field: 'lastName',
                            title: 'Last Name',
                            renderer: data => <span>{data.lastName}</span>,
                            editor: data => <Input />
                        },
                        {
                            field: 'address',
                            title: 'Address',
                            renderer: data => <span>{data.address}</span>,
                            editor: data => <Input />
                        },
                        {
                            field: 'description',
                            title: 'Description',
                            renderer: data => <span>{data.description}</span>,
                            editor: data => <Input />
                        },
                        {
                            field: 'isAdmin',
                            title: 'Is Admin',
                            renderer: data => (
                                <span>{data.isAdmin ? 'True' : 'False'}</span>
                            ),
                            editor: data => {
                                return (
                                    <BooleanInput
                                        onChange={v => {
                                            data.isAdmin = v; // Esto es un horror, pero no tuve opci�n
                                        }}
                                    />
                                );
                            }
                        },
                        {
                            field: 'adminType',
                            title: 'Admin Type',
                            renderer: data =>
                                data.isAdmin ? (
                                    <span>{AdminType[data.adminType]}</span>
                                ) : (
                                    <span
                                        style={{
                                            backgroundColor: '#D3D3D3'
                                        }}
                                    />
                                ),
                            editor: data => (
                                <AdminTypeSelect disabled={!data.isAdmin} />
                            )
                        }
                    ] as Array<TableColumn<User>>
                }
            />
        </Content>
    );
};
