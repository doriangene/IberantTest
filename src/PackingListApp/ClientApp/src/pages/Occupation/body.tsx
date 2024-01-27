import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import {  NewOccupationItem , NewOccupationItemStore } from 'src/stores/occupation-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';


interface NewOccupationItemViewProps {
    onClose: (id: string | undefined, item?: NewOccupationItem) => void;
}

interface NewOccupationItemViewState {

}

interface ClassFormBodyProps {
    item: NewOccupationItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class OccupationItemFormBody extends React.Component<ClassFormBodyProps> {

    render() {

        const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewOccupationItem;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Title"}>
                        {getFieldDecorator(nameof<NewOccupationItem>('title'), {
                            initialValue: item.title,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Description'}>
                        {getFieldDecorator(nameof<NewOccupationItem>('description'), {
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

@connect(["newOccupationItem", NewOccupationItemStore])
class NewOccupationItemView extends React.Component<NewOccupationItemViewProps & FormComponentProps, NewOccupationItemViewState> {
    private get OccupationItemsStore() {
        return (this.props as any).newOccupationItem as NewOccupationItemStore;
    }

    constructor(props: NewOccupationItemViewProps & FormComponentProps) {
        super(props);
        this.OccupationItemsStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: NewOccupationItemViewProps) {
        if (this.OccupationItemsStore.state.result && this.OccupationItemsStore.state.result.isSuccess)
            nextProps.onClose((this.OccupationItemsStore.state.result as any).aggregateRootId, this.OccupationItemsStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.OccupationItemsStore.change(values);
                    self.OccupationItemsStore.submit().then(result => {
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
        this.OccupationItemsStore.clear();
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
                {this.OccupationItemsStore.state.result && !this.OccupationItemsStore.state.result.isSuccess && (
                    <Alert type='error'
                    message="An error has occurred"
                    description={this.OccupationItemsStore.state.result.messages.map(o => o.body).join(", ")}
                    />)}
                <Spin spinning={this.OccupationItemsStore.state.isBusy}>
                    <OccupationItemFormBody item={this.OccupationItemsStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewOccupationItemView as any) as any as React.ComponentClass<NewOccupationItemViewProps>;