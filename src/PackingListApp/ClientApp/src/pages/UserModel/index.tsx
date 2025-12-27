import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col, Checkbox, Select } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
// Importamos UsersDataStore que es el que maneja la colección (DataStore)
import { UsersDataStore, UserData } from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewUserDataView from "./body";

interface UserDataListProps extends RouteComponentProps {}

interface UserDataListState {
  query: Query;
  newShow: boolean;
}

// Conectamos a UsersDataStore para obtener la lista de usuarios
@connect(["UserData", UsersDataStore])
export default class UserDataListPage extends Component<
  UserDataListProps,
  UserDataListState
> {
  private id: number = -1;

  // El getter debe devolver el tipo correcto UsersDataStore
  private get UserDataStore() {
    return (this.props as any).UserData as UsersDataStore;
  }

  constructor(props: UserDataListProps) {
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
    await this.UserDataStore.getAllAsync(query);
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
  private async onSaveItem(item: UserData, state: ItemState) {
    // saveAsync es el método estándar para guardar cambios en la fila
    var result = await this.UserDataStore.saveAsync(`${item.id}`, item, state);
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
    item: UserData,
    state: ItemState
  ): Promise<CommandResult<any>> {
    // deleteAsync para eliminar registros
    return await this.UserDataStore.deleteAsync(`${item.id}`);
  }

  render() {
    const tableModel = {
      query: this.state.query,
      columns: [
        {
          field: "name",
          title: "Nombre",
          renderer: (data) => <span>{data.name}</span>,
          editor: (data) => <Input />,
        },
        {
          field: "lastName",
          title: "Apellidos",
          renderer: (data) => <span>{data.lastName}</span>,
          editor: (data) => <Input />,
        },
        {
          field: "address",
          title: "Dirección",
          renderer: (data) => <span>{data.address}</span>,
          editor: (data) => <Input maxLength={10} />,
        },
        {
          field: "isAdmin",
          title: "Admin",
          renderer: (data) => <Checkbox checked={data.isAdmin} disabled />,
          editor: (data) => <Checkbox />, // Permite editar directamente en la fila
        },
        {
          field: "category",
          title: "Categoría",
          renderer: (data) => {
            const names = { 1: "Normal", 2: "Vip", 3: "King" };
            return <span>{names[data.category] ?? "N/A"}</span>;
          },
          editor: (data) => (
            <Select style={{ width: 120 }}>
              <Select.Option value={1}>Normal</Select.Option>
              <Select.Option value={2}>Vip</Select.Option>
              <Select.Option value={3}>King</Select.Option>
            </Select>
          ),
        },
      ],
      data: this.UserDataStore.state, // Accede al estado de la lista
      sortFields: [],
    } as TableModel<UserData>;

    return (
      <Layout>
        <HeaderComponent title="UserData" canGoBack={true} />

        <Content className="page-content">
          {this.UserDataStore.state.result &&
            !this.UserDataStore.state.result.isSuccess && (
              <Alert
                type="error"
                message={"Ha ocurrido un error"}
                description={this.UserDataStore.state.result.messages
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
              <NewUserDataView onClose={this.onNewItemClosed} />
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}
