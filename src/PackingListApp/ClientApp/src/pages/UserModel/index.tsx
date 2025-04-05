import React, { Component } from "react";
import { Layout, Input, Alert, Checkbox, Select, Icon } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import {
    UserItemsStore,
    UserItem,
    adminType
} from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
const { Content } = Layout;
import NewUserItemView from "./body"

enum MODAL_INFO{
    EDIT_INFO,
    CREATE_INFO,
    NONE,
}


interface UserItemListProps extends RouteComponentProps { }

interface UserItemListState {
    query: Query;
    isAdmin: boolean;
    openInfoModal:MODAL_INFO;
    user?:UserItem;
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
            openInfoModal:MODAL_INFO.NONE,
            isAdmin: false,
            user:undefined,
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
        this.setState({openInfoModal:MODAL_INFO.CREATE_INFO})
    }

    @autobind
    private async onEditItem(item:UserItem) {
        this.setState({openInfoModal:MODAL_INFO.EDIT_INFO})
        this.setState({user:item} )
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
    private onClosed() {
        this.setState({openInfoModal:MODAL_INFO.NONE})
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
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    renderer:data => <Icon type='edit' onClick={()=>this.onEditItem(data)} />
                },
                {
                    field: "name",
                    title: "Name",
                    align: "center",
                    renderer: data => <span>{data.name}</span>,
                    editor: data => <Input />
                },
                {
                    field: "lastName",
                    title: "Last Name",
                    align: "center",
                    renderer: data => <span>{data.lastName}</span>,
                    editor: data => <Input />
                },
                {
                    field: "address",
                    title: "Address",
                    align: "center",
                    renderer: data => <span>{data.address}</span>,
                    editor: data => <Input />
                },
                {
                    field: "isAdmin",
                    title: "Is Admin",
                    align: "center",
                    renderer: data => <span>{data.isAdmin ? "Yes" : "No"}</span>,
                    editor: data => <Checkbox defaultChecked={data.isAdmin} onChange={()=> this.setState(() => ({isAdmin: !this.state.isAdmin}))}/>
                },
                {
                    field: "adminType",
                    title: "Admin Type",
                    align: "center",
                    renderer: data => <span>{data.adminType ?  adminType[data.adminType] : "-"}</span>,
                    editor: ()  => <Select style={{width: '90%'}}>
                                        <option value={adminType.None}>-</option>
                                        <option value={adminType.Normal}>Normal</option>
                                        <option value={adminType.Vip}>Vip</option>
                                        <option value={adminType.King}>King</option>
                                    </Select>
                },
                {
                    field: "occupation",
                    title: "Occupation",
                    align: "center",
                    renderer: data => <span>{data.occupationModelId ? data.occupation?.title : "-"}</span>,
                    
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
                            canDelete={true}
                            canCreateNew={true}
                            onSaveRow={this.onSaveItem}
                            hidepagination={true}
                            canEdit={false}
                            onDeleteRow={this.onDeleteRow}
                        />
                       
                        {this.state.openInfoModal===MODAL_INFO.CREATE_INFO && <NewUserItemView  onClose={this.onClosed} />}
                        {this.state.openInfoModal===MODAL_INFO.EDIT_INFO && 
                        <NewUserItemView 
                        onClose={this.onClosed} 
                        isEdit={true}  
                        item={this.state.user}
                        />}
                    </div>
                </Content>
            </Layout>
        );
    }
}
