import React, { Component } from "react";
import { Button, Layout, Input, Alert, Row, Col, Checkbox, Select } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { UsersDataStore, UserData } from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import { NewUserDataView, EditUserDataView } from "./body";

interface UserDataListProps extends RouteComponentProps {}

interface UserDataListState {
  query: Query;
  newShow: boolean;
  editShow: boolean;
  itemToEdit: UserData | null;
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
      editShow: false,
      itemToEdit: null,
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
    const result = await this.UserDataStore.deleteAsync(`${item.id}`);
    if (result.isSuccess) {
      await this.load(this.state.query);
    }
    return result;
  }

  @autobind
  private onEditRow(item: UserData) {
    this.setState({
      editShow: true,
      itemToEdit: item, // Guardamos el usuario seleccionado
    });
  }

  @autobind
  private onEditClosed() {
    this.setState({ editShow: false, itemToEdit: null });
  }

  @autobind
  private async onSaveEditedItem(id: number, item: UserData) {
    var result = await this.UserDataStore.saveAsync(`${id}`, item, "Changed");
    if (result.isSuccess) {
      await this.load(this.state.query); // Recargar tabla si tuvo éxito
    }
    return result;
  }

  render() {
    const tableModel = {
      query: this.state.query,
      columns: [
        {
          field: "name",
          title: "Nombre",
          renderer: (data) => <span>{data.name}</span>,
        },
        {
          field: "lastName",
          title: "Apellidos",
          renderer: (data) => <span>{data.lastName}</span>,
        },
        {
          field: "address",
          title: "Dirección",
          renderer: (data) => <span>{data.address}</span>,
        },
        {
          field: "isAdmin",
          title: "Admin",
          renderer: (data) => <Checkbox checked={data.isAdmin} disabled />,
        },
        {
          field: "category",
          title: "Categoría",
          renderer: (data) => {
            const names = { 1: "Normal", 2: "Vip", 3: "King" };
            return <span>{names[data.category] ?? "N/A"}</span>;
          },
        },
        {
          field: "occupation",
          title: "Ocupación",
          renderer: (data) => <span>{data.occupation?.title || "N/A"}</span>,
        },
        {
          field: "actions",
          title: "Acciones",
          renderer: (data) => (
            <div>
              <Button
                type="primary"
                size="small"
                icon="edit"
                onClick={() => this.onEditRow(data)}
              >
                Editar
              </Button>
            </div>
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
              onDeleteRow={this.onDeleteRow}
              canDelete={true}
              canCreateNew={true}
              onSaveRow={this.onSaveItem}
              hidepagination={true}
              canEdit={true}
            />

            {this.state.newShow && (
              <NewUserDataView onClose={this.onNewItemClosed} />
            )}

            {this.state.editShow && this.state.itemToEdit && (
              <EditUserDataView
                visible={this.state.editShow}
                item={this.state.itemToEdit}
                onClose={this.onEditClosed}
                onSave={this.onSaveEditedItem}
              />
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}
