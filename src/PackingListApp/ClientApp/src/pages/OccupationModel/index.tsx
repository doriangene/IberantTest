import React, { Component } from "react";
import { Layout, Input, Alert, Row, Col } from "antd";
import HeaderComponent from "../../components/shell/header";
import { TableModel, TableView } from "../../components/collections/table";
import { RouteComponentProps } from "react-router";
import { Query, ItemState } from "../../stores/dataStore";
import { OccupationsStore, Occupation } from "src/stores/occupation-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { CommandResult } from "../../stores/types";
import { Link } from "react-router-dom";
import { formatDate } from "src/utils/object";
const { Content } = Layout;
import NewOccupationView from "./body";

interface OccupationListProps extends RouteComponentProps {}

interface OccupationListState {
  query: Query;
  newShow: boolean;
}

@connect(["Occupations", OccupationsStore])
export default class OccupationListPage extends Component<
  OccupationListProps,
  OccupationListState
> {
  private id: number = -1;
  private get OccupationsStore() {
    return (this.props as any).Occupations as OccupationsStore;
  }

  constructor(props: OccupationListProps) {
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
    await this.OccupationsStore.getAllAsync(query);
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
  private async onSaveItem(item: Occupation, state: ItemState) {
    var result = await this.OccupationsStore.saveAsync(
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
    item: Occupation,
    state: ItemState
  ): Promise<CommandResult<any>> {
    const result = await this.OccupationsStore.deleteAsync(`${item.id}`);
    if (result.isSuccess) {
      await this.load(this.state.query);
    }
    return result;
  }

  render() {
    const tableModel = {
      query: this.state.query,
      columns: [
        {
          field: "title",
          title: "Title",
          renderer: (data) => <span>{data.title}</span>,

          editor: (data) => <Input />,
        },
        {
          field: "description",
          title: "Description",
          renderer: (data) => <span>{data.description}</span>,
          editor: (data) => <Input />,
        },
      ],
      data: this.OccupationsStore.state,
      sortFields: [],
    } as TableModel<Occupation>;

    return (
      <Layout>
        <HeaderComponent title="Ocupaciones" canGoBack={true} />

        <Content className="page-content">
          {this.OccupationsStore.state.result &&
            !this.OccupationsStore.state.result.isSuccess && (
              <Alert
                type="error"
                message={"Ha ocurrido un error"}
                description={this.OccupationsStore.state.result.messages
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
              <NewOccupationView onClose={this.onNewItemClosed} />
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}
