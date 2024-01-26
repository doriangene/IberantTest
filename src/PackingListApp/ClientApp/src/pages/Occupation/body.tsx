import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import {  NewTestItem , NewTestItemStore } from 'src/stores/test-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';


interface NewTestItemViewProps {
    onClose: (id: string | undefined, item?: NewTestItem) => void;
}

interface NewTestItemViewState {

}

interface ClassFormBodyProps {
    item: NewTestItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class TestItemFormBody extends React.Component<ClassFormBodyProps> {

    render() {

        const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewTestItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Title"}>
                        {getFieldDecorator(nameof<NewTestItem>('title'), {
                            initialValue: item.title,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Description'}>
                        {getFieldDecorator(nameof<NewTestItem>('description'), {
                            initialValue: item.description,
                        })(
                            <Input  />
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    }
}

@connect(["newTestItem", NewTestItemStore])
class NewTestItemView extends React.Component<NewTestItemViewProps & FormComponentProps, NewTestItemViewState> {
    private get TestItemsStore() {
        return (this.props as any).newTestItem as NewTestItemStore;
    }

    constructor(props: NewTestItemViewProps & FormComponentProps) {
        super(props);
        this.TestItemsStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: NewTestItemViewProps) {
        if (this.TestItemsStore.state.result && this.TestItemsStore.state.result.isSuccess)
            nextProps.onClose((this.TestItemsStore.state.result as any).aggregateRootId, this.TestItemsStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.TestItemsStore.change(values);
                    self.TestItemsStore.submit().then(result => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.TestItemsStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width='800px'
                title={"New Occupation"}>
                {this.TestItemsStore.state.result && !this.TestItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.TestItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.TestItemsStore.state.isBusy}>
                    <TestItemFormBody item={this.TestItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewTestItemView as any) as any as React.ComponentClass<NewTestItemViewProps>;