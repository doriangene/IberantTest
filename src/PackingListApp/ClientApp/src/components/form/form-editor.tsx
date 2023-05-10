import * as React from 'react'
import { Alert, Form, Button, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import autobind from 'autobind-decorator';
import { formatMessage } from 'src/services/http-service';
import { CommandResult } from 'src/stores/types';
let FormItem = Form.Item;

interface FormEditorViewProps extends FormComponentProps{
    children: React.ReactChild,
    onSaveItem: (values: any) => Promise<any>
    style?: React.CSSProperties, 
    autosave: boolean;

}

interface FormEditorViewState {
    isBusy: boolean,
    result: CommandResult<any>;
}

class FormEditorView extends React.Component<FormEditorViewProps, FormEditorViewState> {
    constructor(props: FormEditorViewProps) {
        super(props);
        this.state = {
            isBusy: false,
            result: { isSuccess: true, items: [], messages: [] }
        }
    }

    componentDidUpdate(prevProps: FormEditorViewProps) {
        if (prevProps.autosave != this.props.autosave)
            this.onSaveItem();
    }


    @autobind
    private onSaveItem() {
        this.setState({ isBusy: true })
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    return new Promise((resolve1, reject1) => {
                        self.props.onSaveItem(values).then(res => {
                            this.setState({ isBusy: false, result: res })
                            self.props.form.resetFields();
                            resolve(res);
                        }).catch(error => {
                            var parsedError = error && error.response && error.response.data && error.response.data.messages ? error.response.data : {
                                isSuccess: false,
                                items: [],
                                total: 0,
                                messages: [{ body: formatMessage(error), level: 'Error' }]
                            };
                            this.setState({ isBusy: false, result: parsedError })
                            reject1(error);
                        });
                    });
                }
            });
        })
    }

    @autobind
    private onCancel() {
        this.props.form.resetFields();
        this.setState({ result: { isSuccess: true, items: [], messages: [] } });
    }

    render() {
        const childrenWithProps = React.Children.map(this.props.children, (child: any) => React.cloneElement(child, this.props));
        const { resetFields, isFieldsTouched } = this.props.form;

        return <Spin spinning={this.state.isBusy}>
            {this.state.result && !this.state.result.isSuccess &&
                <Alert style={{ marginBottom: 16 }}
                    type='error'
                    message={'An error ocurred'}
                    description={this.state.result.messages.map((o) => o.body)}
                />
            }
            <div style={this.props.style}>
            <p>form-editor.tsx</p>
                {childrenWithProps}
                <div style={{ paddingTop: 5, paddingBottom: 5, textAlign: "center", marginTop : "10px" }}>
                    {isFieldsTouched() && <div/>
                    //    <div><Button type='primary' style={{ marginRight: "5px", minWidth: "100px" }} onClick={this.onSaveItem}>{'Salvar'}</Button>
                    //        <Button type='default' style={{ marginLeft: "5px", minWidth : "100px" }} onClick={this.onCancel}>{'Cancelar'}</Button></div>
                    }
                </div>
            </div>
        </Spin>;
    }
}

export default FormEditorView;
