import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { OccupationItemsStore, OccupationItem } from "src/stores/occupation-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewOccupationItemView from "./body"

interface OccupationItemListProps extends RouteComponentProps { }

interface OccupationItemListState {
    query: Query;
    newShow: boolean;
}

@connect(["OccupationItems", OccupationItemsStore])
export default class OccupationItemListPage extends Component<OccupationItemListProps, OccupationItemListState> {
    private id: number = -1;
    private get OccupationItemsStore() {
        return (this.props as any).OccupationItems as OccupationItemsStore;
    }

    constructor(props: OccupationItemListProps) {
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
    private async onSaveItem(item: OccupationItem, state: ItemState) {
        var result = await this.OccupationItemsStore.saveAsync(
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
    private async onDeleteRow(item: OccupationItem, state: ItemState): Promise<CommandResult<any>> {
        return await this.OccupationItemsStore.deleteAsync(`${item.id}`);
    }

    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "title",
                    title: "Title",
                    renderer: data => <span>{data.title}</span>,
                    editor: data => <Input />
                },
                {
                    field: "description",
                    title: "Description",
                    renderer: data => <span>{data.description}</span>,
                    editor: data => <Input />
                },
            ],
            data: this.OccupationItemsStore.state,
            sortFields: [
            ]
        } as TableModel<OccupationItem>;

        return (
            <Layout>
                <HeaderComponent title="Occupations" canGoBack={true} />

                <Content className="page-content">
                    {this.OccupationItemsStore.state.result &&
                        !this.OccupationItemsStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"Ha ocurrido un error"}
                                description={this.OccupationItemsStore.state.result.messages
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
                            onDeleteRow={this.onDeleteRow}
                            hidepagination={true}
                            canEdit={true}
                        />
                        {this.state.newShow && <NewOccupationItemView onClose={this.onNewItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
