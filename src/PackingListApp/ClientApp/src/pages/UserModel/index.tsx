import {RouteComponentProps} from "react-router";
import {ItemState, Query} from "../../stores/dataStore";
import {connect} from "redux-scaffolding-ts";
import {AdminType, UserItem, UserItemDtoStore, UserItemStore} from "../../stores/user-store";
import React, {Component} from "react";
import autobind from "autobind-decorator";
import {CommandResult} from "../../stores/types";
import {Input, Layout, Alert} from "antd";
import {TableModel, TableView} from "../../components/collections/table";
import HeaderComponent from "../../components/shell/header";
import UserItemDtoView from "./body";

const { Content } = Layout;
const HEADER_TITLE = "Users";

interface UserItemListProps extends RouteComponentProps {}

interface UserItemListState {
    query: Query;
    newShow: boolean;
    editShow: boolean;
}

@connect(["UserItem", UserItemStore])
export default class UserItemListPage extends 
    Component<UserItemListProps, UserItemListState>{
    
    private id: number = -1;
    
    private get UserItemStore(){
        return (this.props as any).UserItem as UserItemStore;
    }
    
    private get UserItemDtoStore(){
        return (this.props as any).UserItemDto as UserItemDtoStore;
    }
    
    constructor(props: UserItemListProps) {
        super(props);
        
        this.state = {
            query: {
                searchQuery: "",
                orderBy: [{field: "id", direction: "Ascending", useProfile: false}],
                skip: 0,
                take: 10
            },
            newShow: false,
            editShow: false
        }
    }
    
    componentWillMount() {
        this.load(this.state.query)
    }
    
    @autobind
    private async load(query: Query){
        await this.UserItemStore.getAllAsync(query);
    }
    
    @autobind
    private onQueryChanged(query: Query){
        this.setState({query});
        this.load(query);
    }
    
    @autobind
    private async onNewItem(){
        this.setState({newShow: true})
    }
    
    @autobind
    private async onSaveItem(item: UserItem, state: ItemState){
        let result = await this.UserItemStore.saveAsync(
            `${item.id}`,
            item,
            state
        );
        await this.load(this.state.query)
        
        return result;
    }
    
    @autobind
    private onNewItemClosed(){
        this.setState({newShow: false});
        this.load(this.state.query);
    }
    
    @autobind
    private async onDeleteRow(item: UserItem, state: ItemState): 
        Promise<CommandResult<any>>{
        return await this.UserItemStore.deleteAsync(`${item.id}`);
    }
    
    render(){
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "firstName",
                    title: "First Name",
                    renderer: data => 
                        <span>{data.firstname}</span>,
                    editor: data => 
                        <Input />
                },
                {
                    field: "lastName",
                    title: "Last Name",
                    renderer: data => 
                        <span>{data.lastname}</span>,
                    editor: data => <Input />
                },
                {
                    field: "address",
                    title: "Address",
                    renderer: data => 
                        <span>{data.address}</span>,
                    editor: data => <Input />
                },
                {
                    field: "description",
                    title: "Description",
                    renderer: data => 
                        <span>{data.description}</span>,
                    editor: data => <Input />
                },
                {
                    field: "isadmin",
                    title: "Is Admin",
                    renderer: data => 
                        <span>{data.isadmin ? "True": "False"}</span>,
                    editor: data => <Input />
                },
                {
                    field: "admintype",
                    title: "Admin Type",
                    renderer: data => 
                        <span>
                            {data.isadmin ? AdminType[data.admintype as any] : "Not an admin"}
                        </span>,
                    editor: data => <Input />
                }
            ],
            data: this.UserItemStore.state,
            sortFields: [ ]
        } as TableModel<UserItem>
        
        return (
            <Layout>
                <HeaderComponent title={HEADER_TITLE} canGoBack={true}>
                    <Content className="page-content">
                        {
                            this.UserItemStore.state.result &&
                                !this.UserItemStore.state.result.isSuccess &&
                            (
                                <Alert 
                                    type={"error"} 
                                    message={"Ha ocurrido un error"}
                                    description=
                                        {this.UserItemStore.state.result.messages
                                            .map(o => o.body)
                                            .join(", ")}
                                />
                            )
                        }
                        
                        <div style={{margin: "12px"}}>
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

                            {this.state.newShow && (
                                <UserItemDtoView onClose={this.onNewItemClosed}/>
                            )}
                            
                        </div>
                    </Content>
                </HeaderComponent>
            </Layout>
        )
    }
}