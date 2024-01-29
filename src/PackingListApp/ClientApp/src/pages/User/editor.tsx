import React, { Component } from "react";
import { Form, Alert, Card, Tabs, Row, Col, Radio, Layout, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { UserItem, UserItemStore } from "src/stores/user-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { UserItemFormBody } from "./body";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { clone } from "src/utils/object";
import { formatMessage } from "src/services/http-service";
import FormEditorView from "src/components/form/form-editor";
import HeaderComponent from "../../components/shell/header";
const { Content } = Layout;
import axios from 'axios';

interface UserItemViewProps extends RouteComponentProps<{id: string}> {
    onClose: (id: string | undefined, item?: UserItem) => void;
}

interface UserItemViewState {
    editView: boolean;
    //newShow: boolean,
    //occupations: any[],
}

@connect(["UserItems", UserItemStore])
class UserItemView extends Component<UserItemViewProps & FormComponentProps, UserItemViewState> {
    private get UserItemStore() {
        return (this.props as any).UserItems as UserItemStore;
    }

    constructor(props: UserItemViewProps & FormComponentProps) {
        super(props);
        this.state = {
            editView: true,
            //newShow: false,
            //occupations: [] as any[],
        };
    }

    componentWillMount() {
        this.load();
    }

    @autobind
    private async load() {
        await this.UserItemStore.getById(this.props.match.params.id);
    }

    @autobind
    private async updateItem(values: any): Promise<any> {
        return this.UserItemStore.Update(Object.assign(clone(this.UserItemStore.state.item), values));
    }

    @autobind
    private onChanged(event: any) {
        const target = event.target.value;
        this.setState({ ...target, editView: true });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <HeaderComponent title="User Items" canGoBack={true} />
                <Content className="page-content">
                    <Row type={"flex"} align={"top"} justify={"space-between"}>
                        {this.UserItemStore.state.result && !this.UserItemStore.state.result.isSuccess &&
                        <Alert type='error'
                            message="An error has occurred"
                            description={this.UserItemStore.state.result.messages.map(o => o.body).join(", ")}
                            />}
                        <Card style={{ width: "100%" }}>
                            {this.UserItemStore.state.item && (
                                <Row gutter={24}>
                                    <FormEditorView onSaveItem={this.updateItem} form={this.props.form}
                                        autosave={false} editView={this.state.editView}>
                                        <UserItemFormBody item={this.UserItemStore.state.item}
                                            getFieldDecorator={getFieldDecorator}
                                            getFieldValue={this.props.form.getFieldValue}
                                            setFieldsValue={this.props.form.setFieldsValue}
                                            editView={this.state.editView} />
                                    </FormEditorView>

                                </Row>
                            )}
                            {this.UserItemStore.state.item && this.state.editView && (
                                <Row gutter={24}>
                                    <Button onClick={() => { this.setState({ editView: false }) }}>Editar</Button>
                                </Row>
                            )}
                        </Card>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
// Wire up the React component to the Redux store
export default (withRouter(Form.create({})(UserItemView) as any) as any) as React.ComponentClass<UserItemViewProps>;