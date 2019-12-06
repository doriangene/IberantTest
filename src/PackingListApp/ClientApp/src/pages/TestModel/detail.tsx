import React, { Component } from "react";
import { Form, Alert, Card, Tabs, Row, Col, Radio, Layout } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { TestItem, TestItemStore } from "src/stores/test-store";
import { connect } from "redux-scaffolding-ts";
import autobind from "autobind-decorator";
import { TestItemFormBody } from "./body";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { clone } from "src/utils/object";
import { formatMessage } from "src/services/http-service";
import FormEditorView from "src/components/form/form-editor";
import HeaderComponent from "../../components/shell/header";
const { Content } = Layout;


interface TestItemViewProps
    extends RouteComponentProps<{ id: string }> {
    onClose: (id: string | undefined, item?: TestItem) => void;
}

interface TestItemViewState { }

@connect(["TestItems", TestItemStore])
class TestItemView extends React.Component<
TestItemViewProps & FormComponentProps,
TestItemViewState
> {
    private get TestItemStore() {
        return (this.props as any).TestItems as TestItemStore;
    }

    constructor(props: TestItemViewProps & FormComponentProps) {
        super(props);
        this.state = {};
    }

    componentWillMount(): void {
        this.load();
    }

    @autobind
    private load() {
        return this.TestItemStore.getById(this.props.match.params.id);
    }

    @autobind
    private handleUpdateItem(values: any): Promise<any> {

        return this.TestItemStore.Update(
            Object.assign(clone(this.TestItemStore.state.item), values)
        );
    }

    @autobind
    private onDashboardChanged(e: any) {
        const dashboard = e.target.value;
        this.setState({ dashboard });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <HeaderComponent title="TestItemes" canGoBack={true} />
                <Content className="page-content">
                
                    <Row type={"flex"} align="top" justify="space-between">
                        {this.TestItemStore.state.result &&
                            !this.TestItemStore.state.result.isSuccess && (
                                <Alert
                                    type="error"
                                    message={"Ha ocurrido un error"}
                                    description={formatMessage(this.TestItemStore.state.result)}
                                />
                            )}
                        <Card style={{ width: "100%" }}>
                            {this.TestItemStore.state.item && (
                                <Row gutter={24}>
                                    <FormEditorView
                                        onSaveItem={this.handleUpdateItem}
                                        form={this.props.form}
                                        autosave={false}
                                    >
                                        <TestItemFormBody
                                            item={this.TestItemStore.state.item}
                                            getFieldDecorator={getFieldDecorator}
                                            getFieldValue={this.props.form.getFieldValue}
                                            setFieldsValue={this.props.form.setFieldsValue}
                                        />
                                    </FormEditorView>

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
export default (withRouter(Form.create({})(
    TestItemView
) as any) as any) as React.ComponentClass<TestItemViewProps>;
