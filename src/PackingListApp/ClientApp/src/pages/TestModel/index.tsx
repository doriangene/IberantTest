import { Alert, Col, Input, Layout, Row } from "antd";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "redux-scaffolding-ts";
import {
    NewTestItemStore,
    TestItem,
    TestItemsStore,
} from "src/stores/test-store";
import { TableColumn, TableModel, TableView } from "../../components/collections/table";
import HeaderComponent from "../../components/shell/header";
import { ItemState, Query } from "../../stores/dataStore";
const { Content } = Layout;
import CrudTable, { CrudModel } from "../common/CrudTable";
import TestItemFormBody from "./body";

interface TestItemListProps extends RouteComponentProps {
    DataStore: TestItemsStore;
    CreationStore: NewTestItemStore;
}

interface TestItemListState {
    query: Query;
    newShow: boolean;
}

@connect(["CreationStore", NewTestItemStore])
@connect(["DataStore", TestItemsStore])
export default class TestItemListPage extends Component<TestItemListProps, TestItemListState> {
    public render() {
        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    <CrudTable
                        CreationStore={this.props.CreationStore}
                        DataStore={this.props.DataStore}
                        CreationFormBody={TestItemFormBody}
                        TableColumns={[
                            {
                                field: "title",
                                title: "Title",
                                renderer: (data) =>
                                    <span>{data.title}</span>,
                                editor: (data) => <Input />,
                            },
                            {
                                field: "description",
                                title: "Description",
                                renderer: (data) => <span>{data.description}</span>,
                                editor: (data) => <Input />,
                            },
                        ] as Array<TableColumn<TestItem>>}
                    />
                </Content>
            </Layout>
        );
    }

}
