import { Alert, Form, Modal, Spin } from "antd";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import autobind from "autobind-decorator";
import React, { Component } from "react";
import { formatMessage } from "../../services/http-service";
import { FormStore } from "../../stores/formStore";

export interface NewItemViewProps<T> {
    onClose: (id: string | undefined, item?: T) => void;
    CreationStore: FormStore<T>;
    CreationFormBody: any;
}

export interface FormComponentProps<Item> {
    item: Item | undefined;
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions,
    ): (node: React.ReactNode) => React.ReactNode;
}

export interface FormBodyProps<Item> {
    item: Item | undefined;
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions,
    ): (node: React.ReactNode) => React.ReactNode;
}

// *
/* Generic modal for item creation.
/*/
class NewItemView<T> extends Component<
    NewItemViewProps<T> & FormComponentProps<T>
> {

    constructor(props: NewItemViewProps<T> & FormComponentProps<T>) {
        super(props);
        this.CreationStore.createNew({} as any);
    }
    private get CreationStore() {
        return this.props.CreationStore;
    }

    private get form() {
        return (this.props as any).form;
    }

    public componentWillReceiveProps(nextProps: NewItemViewProps<T>) {
        if (
            this.CreationStore.state.result &&
            this.CreationStore.state.result.isSuccess
        ) {
            nextProps.onClose(
                (this.CreationStore.state.result as any).aggregateRootId,
                this.CreationStore.state.item,
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
                onOk={this.onCreateNewItem}
                closable={false}
                width="800px"
                title={"New Item"}
            >
                {this.CreationStore.state.result &&
                    !this.CreationStore.state.result.isSuccess && (
                        <Alert
                            type="error"
                            message="Ha ocurrido un error"
                            description={formatMessage(
                                this.CreationStore.state.result,
                            )}
                        />
                    )}
                <Spin spinning={this.CreationStore.state.isBusy}>
                    <FormBody
                        item={this.CreationStore.state.item}
                        getFieldDecorator={getFieldDecorator}
                        getFieldValue={this.form.getFieldValue}
                        setFieldsValue={this.form.setFieldsValue}
                        onSave={this.onCreateNewItem}
                    />
                </Spin>
            </Modal>
        );
    }

    @autobind
    private onCreateNewItem() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.form.validateFields((event: Event) => {
                let values = self.form.getFieldsValue();
                if (!event) {
                    values = { ...values };
                    self.CreationStore.change(values);
                    self.CreationStore.submit().then((result) => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
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
    NewItemView as any,
) as any) as React.ComponentClass<NewItemViewProps<any>>;
