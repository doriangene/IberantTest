import React, { Component } from "react";
import { Layout, Input, Alert, Tag, Checkbox, Select } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import type { Query, ItemState } from "../../stores/dataStore";
import { UsersStore, AdminType } from "src/stores/user-store";
import type { User } from "src/stores/user-store";
import type { RouteComponentProps } from "react-router";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import type { CommandResult } from "../../stores/types";
const { Content } = Layout;
import NewUserView from "./body";

interface UserListProps extends RouteComponentProps {}

interface UserListState {
  query: Query;
  newShow: boolean;
}

@connect(["Users", UsersStore])
export default class UserListPage extends Component<
  UserListProps,
  UserListState
> {
  private get UsersStore() {
    return (this.props as any).Users as UsersStore;
  }

  constructor(props: UserListProps) {
    super(props);

    this.state = {
      query: {
        searchQuery: "",
        orderBy: [{ field: "id", direction: "Ascending", useProfile: false }],
        skip: 0,
        take: 10,
      },
      newShow: false,
    };
  }

  componentWillMount() {
    this.load(this.state.query);
  }

  @autobind
  private async load(query: Query) {
    await this.UsersStore.getAllAsync(query);
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
  private async onSaveItem(item: User, state: ItemState) {
    if (!item.isAdmin) {
      item.adminType = undefined;
    }
    var result = await this.UsersStore.saveAsync(`${item.id}`, item, state);
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
    item: User,
    state: ItemState
  ): Promise<CommandResult<any>> {
    return await this.UsersStore.deleteAsync(`${item.id}`);
  }

  render() {
    const tableModel = {
      query: this.state.query,
      columns: [
        {
          field: "name",
          title: "Name",
          renderer: (data: User) => <span>{data.name}</span>,
          editor: (data: User) => <Input />,
        },
        {
          field: "lastNames",
          title: "Last Names",
          renderer: (data: User) => <span>{data.lastNames}</span>,
          editor: (data: User) => <Input />,
        },
        {
          field: "address",
          title: "Address",
          renderer: (data: User) => <span>{data.address}</span>,
          editor: (data: User) => <Input />,
        },
        {
          field: "isAdmin",
          title: "Role",
          renderer: (data: User) => (
            <span>
              {data.isAdmin ? (
                <Tag color="red">Admin ({AdminType[data.adminType!]})</Tag>
              ) : (
                <Tag color="blue">User</Tag>
              )}
            </span>
          ),
          editorValuePropName: "checked",
          editor: (data: User, form: any) => (
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  form.setFieldsValue({ adminType: AdminType.Normal });
                } else {
                  form.setFieldsValue({ adminType: undefined });
                }
              }}
            />
          ),
        },
        {
          field: "adminType",
          title: "Admin Type",
          renderer: (data: User) => (
            <span>{data.isAdmin ? AdminType[data.adminType!] : "-"}</span>
          ),
          editor: (data: User, form: any) => (
            <Select disabled={!form.getFieldValue("isAdmin")}>
              <Select.Option value={AdminType.Normal}>Normal</Select.Option>
              <Select.Option value={AdminType.Vip}>Vip</Select.Option>
              <Select.Option value={AdminType.King}>King</Select.Option>
            </Select>
          ),
        },
      ],
      data: this.UsersStore.state,
      sortFields: [],
    } as TableModel<User>;

    return (
      <Layout>
        <HeaderComponent title="Users" canGoBack={true} />

        <Content className="page-content">
          {this.UsersStore.state.result &&
            !this.UsersStore.state.result.isSuccess && (
              <Alert
                type="error"
                message={"Ha ocurrido un error"}
                description={this.UsersStore.state.result.messages
                  .map((o) => o.body)
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
              canEdit={true}
            />
            {this.state.newShow && (
              <NewUserView onClose={this.onNewItemClosed} />
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}
