import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col, Select, Checkbox } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { UserItemsStore, UserItem, AdminType } from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewUserItemView from "./body"
import axios from 'axios';

interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    newShow: boolean;
    editShow: boolean;
    occupations: any[];
}

@connect(["UserItems", UserItemsStore])
export default class UserItemListPage extends Component<UserItemListProps, UserItemListState> {
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
            newShow: false,
            editShow: false,
            occupations: [] as any[],
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
    private async onDeleteRow(item: UserItem, state: ItemState): Promise<CommandResult<any>> {
        return await this.UserItemsStore.deleteAsync(`${item.id}`);
    }

    loadOccupations = async () => {
        try {
            const response = await axios.get('api/occupation');
            const occupationsArray = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
            this.setState({ occupations: occupationsArray });
        } catch (error) {
            console.error('Error getting occupations', error);
        }
    };

    componentDidMount() {
        this.loadOccupations();
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
                },
                {
                    field: "isAdmin",
                    title: "Is Admin",
                    renderer: data => data.isAdmin ? <span>Yes</span> : <span>No</span>,
                    editor: data => (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center' }}>
                            <Checkbox checked={data.isAdmin} onChange={(e) => data.isAdmin = e.target.checked} />
                        </div>
                    )
                },
                {
                    field: "adminType",
                    title: "Admin Type",
                    renderer: data => data.isAdmin ? <span>{AdminType[data.adminType]}</span> : <span>X</span>,
                    editor: data => (
                        <Select value={data.isAdmin ? data.adminType : AdminType.None}
                            style={{ width: 100 }}
                            onChange={(value: AdminType) => data.adminType = value} disabled={!data.isAdmin}>
                            <option value={AdminType.Normal}>Normal</option>
                            <option value={AdminType.Vip}>Vip</option>
                            <option value={AdminType.King}>King</option>
                        </Select>
                    )
                },
                {
                    field: "occupationId",
                    title: "Occupation",
                    renderer: data => {
                        const matchedOccupation = data.occupationId != null
                            ? this.state.occupations.find(occupation => occupation.id == data.occupationId) : null;
                        return (<span>{matchedOccupation ? matchedOccupation.title : "Non-occupation"}</span>);
                    },
                    editor: data => (
                        <Select placeholder="Non-occupation" value={data.occupationId}
                            style={{ width: 180 }}
                            onChange={(value: number | null) => data.occupationId = value}>
                            <option value={undefined}>Non-occupation</option>
                            {this.state.occupations.map(occupation => (
                                <option key={occupation.id} value={occupation.id}>{occupation.title}</option>
                            ))}
                        </Select>
                    )
                },
            ],
            data: this.UserItemsStore.state,
            sortFields: [
            ]
        } as TableModel<UserItem>;

        return (
            <Layout>
                <HeaderComponent title="Users" canGoBack={true} />

                <Content className="page-content">
                    {this.UserItemsStore.state.result &&
                        !this.UserItemsStore.state.result.isSuccess && (
                            <Alert
                                type="error"
                                message={"An error has occurred"}
                                description={this.UserItemsStore.state.result.messages.map(o => o.body).join(", ")}
                            />)}
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
                        {this.state.newShow && <NewUserItemView onClose={this.onNewItemClosed} />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
