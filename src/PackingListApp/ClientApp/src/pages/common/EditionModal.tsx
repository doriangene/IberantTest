import { Alert, Form, Modal, Spin } from 'antd';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import { formatMessage } from '../../services/http-service';
import { ItemState } from '../../stores/dataStore';
import { FormStore } from '../../stores/formStore';
import { User } from '../../stores/userStore';

export interface EditionModalProps<T> {
    onClose: (id: string | undefined, item?: T) => void;
    CreationStore: FormStore<T>;
    CreationFormBody: any;
    onSave: (item: T, state: ItemState) => Promise<any>;
}

export interface FormComponentProps<Item> {
    item: Item | undefined;
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions
    ): (node: React.ReactNode) => React.ReactNode;
}

export interface FormBodyProps<Item> {
    item: Item | undefined;
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions
    ): (node: React.ReactNode) => React.ReactNode;
}

// *
/* Generic modal for item creation.
/*/
class EditionModal<T> extends Component<
    EditionModalProps<T> & FormComponentProps<T>
> {
    constructor(props: EditionModalProps<T> & FormComponentProps<T>) {
        super(props);
    }
    private get CreationStore() {
        return this.props.CreationStore;
    }

    private get form() {
        return (this.props as any).form;
    }

    public componentWillReceiveProps(nextProps: EditionModalProps<T>) {
        if (
            this.CreationStore.state.result &&
            this.CreationStore.state.result.isSuccess
        ) {
            nextProps.onClose(
                (this.CreationStore.state.result as any).aggregateRootId,
                this.CreationStore.state.item
            );
        }
    }

    public render() {
        const { getFieldDecorator } = this.form;

        const FormBody = this.props.CreationFormBody; // Required for component initialization (?)
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onEditItem}
                closable={false}
                width="800px"
                title={'Edit Item'}
            >
                {this.CreationStore.state.result &&
                    !this.CreationStore.state.result.isSuccess && (
                        <Alert
                            type="error"
                            message="Ha ocurrido un error"
                            description={formatMessage(
                                this.CreationStore.state.result
                            )}
                        />
                    )}
                <Spin spinning={this.CreationStore.state.isBusy}>
                    <FormBody
                        item={this.CreationStore.state.item}
                        getFieldDecorator={getFieldDecorator}
                        getFieldValue={this.form.getFieldValue}
                        setFieldsValue={this.form.setFieldsValue}
                        onSave={this.onEditItem}
                    />
                </Spin>
            </Modal>
        );
    }

    @autobind
    private onEditItem() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.form.validateFields((event: Event) => {
                let values = self.form.getFieldsValue();
                if (!event) {
                    values = { ...values };
                    self.CreationStore.change(values);
                    self.props.onSave(self.CreationStore.state.item as T, "Changed" as ItemState).then((result) => {
                        if (result.isSuccess) {
                            resolve()
                        }

                    })
                        .catch(reject)
                }
            });
        });
    }

    @autobind
    private onCancelNewItem() {
        this.CreationStore.clear();
        this.props.onClose(undefined);
    }
}

export default (Form.create({})(
    EditionModal as any
) as any) as React.ComponentClass<EditionModalProps<any>>;
