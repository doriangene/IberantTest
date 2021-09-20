import {
    UserItem,
    UserItemDto,
    UserItemStore,
    UserItemDtoStore
} from "../../stores/user-store";
import {GetFieldDecoratorOptions} from "antd/lib/form/Form";
import React from "react";
import {nameof} from 'src/utils/object';
import {Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table} from 'antd';
import BooleanInput from "../../components/form/booleanInput";
import {AdminTypeComponent} from "./adminTypeComponent";
import {connect} from "redux-scaffolding-ts";
import {FormComponentProps} from "antd/lib/form";
import autobind from "autobind-decorator";
import {formatMessage} from "../../services/http-service";
import {UserItemFormBody} from "./body";


interface UserItemDtoViewProps {
    onClose: (id: string | undefined, item?: UserItemDto) => void;
}

interface ClassFormBodyProps {
    item: UserItemDto | undefined
    onSave?: () => Promise<any>;

    setFieldsValue(obj: Object): void;

    getFieldValue(fieldName: string): any;

    getFieldDecorator<T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions
    ): (node: React.ReactNode) => React.ReactNode;
}

@connect(["DataStore", UserItemStore])
@connect(["CreationStore", UserItemDtoStore])
class ModalEditItemView extends React.Component<UserItemDtoViewProps & FormComponentProps>{
    
    private get CreationStore(){
        return (this.props as any).CreationStore as UserItemDtoStore;
    }
    
    private get DataStore(){
        return (this.props as any).DataStore as UserItemStore;
    }
    
    constructor(props: UserItemDtoViewProps & FormComponentProps) {
        super(props);
    }
    
    componentWillReceiveProps(nextProps: UserItemDtoViewProps) {
        if (this.CreationStore.state.result && this.CreationStore.state.result.isSuccess){
            nextProps.onClose(
                (this.CreationStore.state.result as any).aggregateRootId,
                this.CreationStore.state.item
            )
        }
    }
    
    @autobind
    private onEditItem(){
        let self = this;
        
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                let values = self.props.form.getFieldsValue();
                
                if (!event) {
                    values = {...values};
                    self.CreationStore.change(values);
                    const item = this.CreationStore.state.item as any;
                    this.DataStore.saveAsync(`${item.id}`, item, "Changed")
                        .then(result => {
                            if (result.isSuccess){
                                this.props
                                    .onClose(`${item.id}`)
                            }
                            else{
                                reject();
                            }
                        })
                    .catch(reject);
                }
            });
        })
    }
    
    @autobind
    private onCancelItem(){
        this.CreationStore.clear();
        this.props.onClose(undefined);
    }
    
    public render() {
        
        const {getFieldDecorator} = this.props.form;
        
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelItem}
                onOk={this.onEditItem}
                closable={false}
                width={"800px"}
                centered
                title={"Edit User Item"}
            >
                {this.CreationStore.state.result && 
                    !this.CreationStore.state.result.isSuccess && (
                        <Alert 
                            type={"error"}
                            message={"Ha ocurrido un error"}
                            description={formatMessage(this.CreationStore.state.result)}
                        />
                )}
                <Spin spinning={this.CreationStore.state.isBusy} >
                    <UserItemFormBody 
                        item={this.CreationStore.state.item} 
                        setFieldsValue={this.props.form.setFieldsValue} 
                        getFieldValue={this.props.form.getFieldValue} 
                        getFieldDecorator={getFieldDecorator}
                    />
                </Spin>
                
            </Modal>
        )
    }
}

export default Form.create({})(
    ModalEditItemView as any
) as any as React.ComponentClass<UserItemDtoViewProps>