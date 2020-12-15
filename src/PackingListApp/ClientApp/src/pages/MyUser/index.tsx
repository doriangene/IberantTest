import { Alert, Input, Layout } from "antd";
import autobind from "autobind-decorator";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "redux-scaffolding-ts";
import {
  AdminType,
  MyUserItem,
  MyUserItemStore
} from "src/stores/my-user-store";
import { TableModel, TableView } from "../../components/collections/table";
import BooleanInput from "../../components/form/booleanInput";
import HeaderComponent from "../../components/shell/header";
import { ItemState, Query } from "../../stores/dataStore";
import { CommandResult } from "../../stores/types";
import NewMyUserItemView from "./body";
import { AdminTypeDropdown } from "./components";
const { Content } = Layout;

interface MyUserItemListState {
  query: Query;
  newShow: boolean;
}

interface MyUserItemListProps extends RouteComponentProps {}

@connect(["MyUserItems", MyUserItemStore])
export default class MyUserItemListPage extends Component<
  MyUserItemListProps,
  MyUserItemListState
> {
  private id: number = -1;
  private get MyUserItemStore() {
    return (this.props as any).MyUserItems as MyUserItemStore;
  }

  constructor(props: MyUserItemListProps) {
    super(props);

    this.state = {
      query: {
        searchQuery: "",
        orderBy: [{ field: "id", direction: "Ascending", useProfile: false }],
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
    await this.MyUserItemStore.getAllAsync(query);
  }

  @autobind
  private onQueryChanged(query: Query) {
    this.setState({ query });
    this.load(query);
  }

  @autobind
  private async onNewItem() {
    this.setState({ newShow: true });
  }

  @autobind
  private async onSaveItem(item: MyUserItem, state: ItemState) {
    var result = await this.MyUserItemStore.saveAsync(
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
  private async onDeleteRow(
    item: MyUserItem,
    state: ItemState
  ): Promise<CommandResult<any>> {
    return await this.MyUserItemStore.deleteAsync(`${item.id}`);
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
          field: "description",
          title: "Description",
          renderer: data => <span>{data.description}</span>,
          editor: data => <Input />
        },
        {
          field: "isAdmin",
          title: "Is Admin",
          renderer: data => <span>{data.isAdmin ? "True" : "False"}</span>,
          editor: data => <BooleanInput onChange={v => (data.isAdmin = v)} />
        },
        {
          field: "adminType",
          title: "Admin Type",
          renderer: data => (
            <span>
              {console.log(data.adminType)}
              {data.isAdmin ? AdminType[data.adminType as any] : "Not an admin"}
            </span>
          ),
          editor: data => <AdminTypeDropdown disabled={!data.isAdmin} />
        }
      ],
      data: this.MyUserItemStore.state,
      sortFields: []
    } as TableModel<MyUserItem>;

    return (
      <Layout>
        <HeaderComponent title="MyUsers" canGoBack={true} />

        <Content className="page-content">
          {this.MyUserItemStore.state.result &&
            !this.MyUserItemStore.state.result.isSuccess && (
              <Alert
                type="error"
                message={"Ha ocurrido un error"}
                description={this.MyUserItemStore.state.result.messages
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
              onDeleteRow={this.onDeleteRow}
              canCreateNew={true}
              onSaveRow={this.onSaveItem}
              hidepagination={true}
              canEdit={true}
            />
            {this.state.newShow && (
              <NewMyUserItemView onClose={this.onNewItemClosed} />
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}
