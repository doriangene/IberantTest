import * as React from 'react'
import { Form, Spin, Select, Input, Modal, Row, Col, Alert } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import {  adminType, NewUserItem, UserItem, UserItemStore } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';
import { OccupationItem, OccupationItemsStore } from 'src/stores/occupation-store';
import { DataModel, Query } from 'src/stores/dataStore';
import BooleanInput from 'src/components/form/booleanInput';


interface ClassFormBodyProps {
    item: UserItem | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
    occupationList?:DataModel<OccupationItem>
}
interface ClassFormBodyState{
    isAdmin: boolean;
}
export class UserItemFormBody extends React.Component<ClassFormBodyProps,ClassFormBodyState> {

    constructor(props: ClassFormBodyProps) {
        super(props);

        this.state = {
            isAdmin: props.item? props.item.isAdmin:false,
        };
    }

    render() {
        const { getFieldDecorator } = this.props;
        var item = this.props.item || {} as UserItem;
        var occupationList = this.props.occupationList as DataModel<OccupationItem>;

        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>

                <Col span={12}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUserItem>('name'), {
                            initialValue: item.name,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Last Name'}>
                        {getFieldDecorator(nameof<NewUserItem>('lastName'), {
                            initialValue: item.lastName,
                        })(
                            <Input  />
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUserItem>('address'), {
                            initialValue: item.address,
                        })(
                            <Input  />
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label={'Occupation'}>
                        {getFieldDecorator(nameof<NewUserItem>('occupationModelId'), {
                            initialValue: item.occupationModelId,
                        })(
                            <Select >
                                <option value={undefined}>-</option>
                                {occupationList.items?.map(x => (
                                <option key={x.item.id} value={x.item.id}>
                                        {x.item.title}
                                </option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={4}>
                    <FormItem label={'Is Admin'}>
                        {getFieldDecorator(nameof<NewUserItem>('isAdmin'), {
                            initialValue: item.isAdmin,
                        })(
                            <BooleanInput onChange={(value)=> this.setState(() => ({isAdmin: value}))}/>
                           
                        )}
                    </FormItem>
                </Col>
                {
                    this.state.isAdmin 
                    
                    && <Col span={12}>
                    <FormItem label={'Admin Type'}>
                        {getFieldDecorator(nameof<NewUserItem>('adminType'), {
                            initialValue: item.adminType,
                        })(
                            <Select>
                                <option value={adminType.None}>-</option>
                                <option value={adminType.Normal}>Normal</option>
                                <option value={adminType.Vip}>Vip</option>
                                <option value={adminType.King}>King</option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                }
            </Row>
          

        </Form>
    }
}




interface NewUserItemViewProps {
    onClose: (id: string | undefined, item?: UserItem) => void;
    isEdit?:boolean;
    item?: UserItem,
}

interface NewUserItemViewState {

}
@connect(["OccupationItems", OccupationItemsStore],["UserItems", UserItemStore])
class NewUserItemView extends React.Component<NewUserItemViewProps & FormComponentProps, NewUserItemViewState> {
    
    private get OccupationItemsStore() {
            return (this.props as any).OccupationItems as OccupationItemsStore;
    }
    private get EditUserItemsStore() {
            return (this.props as any).UserItems as UserItemStore;
        }
      

    constructor(props: NewUserItemViewProps & FormComponentProps) {
        super(props);
        this.EditUserItemsStore.createNew({} as any);
        this.OccupationItemsStore.getAllAsync({}as Query);

    }

    componentWillReceiveProps(nextProps: NewUserItemViewProps) {  
        if (this.EditUserItemsStore.state.result && this.EditUserItemsStore.state.result.isSuccess)
            nextProps.onClose((this.EditUserItemsStore.state.result as any).aggregateRootId)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue() as UserItem;
                if(!event){
                    self.EditUserItemsStore.change(values);
                    if(this.props.isEdit && this.props.item){
                            values.id = this.props.item.id;
                            self.EditUserItemsStore.Update(values).then(result => {
                            if (result.isSuccess) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    else {
                        self.EditUserItemsStore.submit()
                        .then(result => {
                            if (result.isSuccess) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.EditUserItemsStore.clear();
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
                title={this.props.isEdit?"Edit User":"New User"}>
                {this.EditUserItemsStore.state.result && !this.EditUserItemsStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.EditUserItemsStore.state.result)}
                    />
                }
                <Spin spinning={this.EditUserItemsStore.state.isBusy && this.OccupationItemsStore.state.isBusy}>
                    <UserItemFormBody 
                    item={this.props.item} 
                    occupationList={this.OccupationItemsStore.state} 
                    getFieldDecorator={getFieldDecorator} 
                    getFieldValue={this.props.form.getFieldValue} 
                    setFieldsValue={this.props.form.setFieldsValue} 
                    onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserItemView as any) as any as React.ComponentClass<NewUserItemViewProps>;