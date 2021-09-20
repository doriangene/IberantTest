import {RouteComponentProps} from "react-router";
import {ItemState, Query} from "../../stores/dataStore";
import {connect} from "redux-scaffolding-ts";
import {
    AdminType,
    UserItem,
    UserItemDtoStore,
    UserItemStore,
} from "../../stores/user-store";
import React, {Component} from "react";
import autobind from "autobind-decorator";
import {CommandResult} from "../../stores/types";
import {Layout, Input, Alert, Row, Col, Checkbox} from "antd";
import {TableModel, TableView} from "../../components/collections/table";
import HeaderComponent from "../../components/shell/header";
import UserItemDtoView from "./body";
import BooleanInput from "../../components/form/booleanInput";
import {AdminTypeComponent} from "./adminTypeComponent";
import  ModalEditItemView  from './modalComponent'

const {Content} = Layout;
const HEADER_TITLE = "Users";

interface UserItemListProps extends RouteComponentProps {
}

interface UserItemListState {
    query: Query;
    newShow: boolean;
    editShow: boolean;
}

@connect(["UserItem", UserItemStore])
@connect(["UserItemDto", UserItemDtoStore])
export default class UserItemListPage extends Component<UserItemListProps,
    UserItemListState> {
    private id: number = -1;

    private get UserItemStore() {
        return (this.props as any).UserItem as UserItemStore;
    }

    private get UserItemDtoStore() {
        return (this.props as any).UserItemDto as UserItemDtoStore;
    }

    constructor(props: UserItemListProps) {
        super(props);

        this.state = {
            query: {
                searchQuery: "",
                orderBy: [{field: "id", direction: "Ascending", useProfile: false}],
                skip: 0,
                take: 10,
            },
            newShow: false,
            editShow: false,
        };
    }

    componentWillMount() {
        this.load(this.state.query);
    }

    @autobind
    private async load(query: Query) {
        await this.UserItemStore.getAllAsync(query);
    }

    @autobind
    private onQueryChanged(query: Query) {
        this.setState({query});
        this.load(query);
    }

    @autobind
    private async onNewItem() {
        this.setState({newShow: true});
    }

    @autobind
    private async onSaveItem(item: UserItem, state: ItemState) {
        let result = await this.UserItemStore.saveAsync(`${item.id}`, item, state);
        await this.load(this.state.query);

        return result;
    }

    @autobind
    private onNewItemClosed() {
        this.setState({newShow: false});
        return this.load(this.state.query);
    }
    
    @autobind 
    private onEditItemClosed(){
        this.setState({editShow: false});
        return this.load(this.state.query);    
    }

    @autobind
    private async onDeleteRow(
        item: UserItem,
        state: ItemState
    ): Promise<CommandResult<any>> {
        return await this.UserItemStore.deleteAsync(`${item.id}`);
    }
    
    @autobind
    private async onEditItem(item: UserItem){
        this.setState({editShow: true})
        this.UserItemDtoStore.createNew({} as any);
        this.UserItemDtoStore.change({...item} as any);
    }

    render() {
        const tableModel = {
            query: this.state.query,
            columns: [
                {
                    field: "firstName",
                    title: "First Name",
                    renderer: (data) => <span>{data.firstName}</span>,
                    editor: (data) => <Input/>,
                },
                {
                    field: "lastName",
                    title: "Last Name",
                    renderer: (data) => <span>{data.lastName}</span>,
                    editor: (data) => <Input/>,
                },
                {
                    field: "address",
                    title: "Address",
                    renderer: (data) => <span>{data.address}</span>,
                    editor: (data) => <Input/>,
                },
                {
                    field: "description",
                    title: "Description",
                    renderer: (data) => <span>{data.description}</span>,
                    editor: (data) => <Input/>,
                },
                {
                    field: "isadmin",
                    title: "Is Admin",
                    renderer: (data) => <span>{data.isAdmin ? "True" : "False"}</span>,
                    editor: (data) => <BooleanInput onChange={v => data.isAdmin = v}/>,
                },
                {
                    field: "admintype",
                    title: "Admin Type",
                    renderer: (data) => (
                        <span>
              {data.isAdmin ? AdminType[data.adminType as any] : "Not an admin"}
            </span>
                    ),
                    editor: (data) => <AdminTypeComponent disabled={!data.isAdmin}/>,
                },
            ],
            data: this.UserItemStore.state,
            sortFields: [],
        } as TableModel<UserItem>;

        return (
            <Layout>
                <HeaderComponent title={HEADER_TITLE} canGoBack={true}/>

                <Content className="page-content">
                    {this.UserItemStore.state.result &&
                    !this.UserItemStore.state.result.isSuccess && (
                        <Alert
                            type={"error"}
                            message={"Ha ocurrido un error"}
                            description={this.UserItemStore.state.result.messages
                                .map((o) => o.body)
                                .join(", ")}
                        />
                    )}

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
                            onModalOpen={this.onEditItem}
                        />

                        {this.state.newShow && (
                            <UserItemDtoView onClose={this.onNewItemClosed}/>
                        )}
                        {this.state.editShow && (
                            <ModalEditItemView
                                onClose={this.onEditItemClosed}
                            />
                        )}
                    </div>
                </Content>
            </Layout>
        );
    }
}