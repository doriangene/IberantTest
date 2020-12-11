import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableColumn, TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    TestItemsStore,
    TestItem,
} from "src/stores/test-store";
import { connect } from "redux-scaffolding-ts";
const { Content } = Layout;
import NewTestItemView from "./body"
import CrudTable from "../ListPage/CrudTable";

interface TestItemListProps extends RouteComponentProps {
    Store: TestItemsStore
}

interface TestItemListState {
    query: Query;
    newShow: boolean;
}





@connect(["TestItems", TestItemsStore])
export default class TestItemListPage extends Component<TestItemListProps, TestItemListState> {
    render() {

        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    <CrudTable
                        Store={this.props.Store}
                        TableColumns={[
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


                        ] as TableColumn<TestItem>[]}
                    />
                </Content>
            </Layout>
        );
    }

}
