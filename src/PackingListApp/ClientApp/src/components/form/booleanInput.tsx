import * as React from 'react';
import { Checkbox } from 'antd';
import autobind from 'autobind-decorator';

interface BooleanInputProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
    label?: string;
    style?: React.CSSProperties;
}


export default class BooleanInput extends React.Component<BooleanInputProps, {}> {
    @autobind
    private handleChange(event: any): void {
        const { onChange } = this.props;
        if (onChange) {
            onChange(event.target.checked);
        }
    }

    render(): React.ReactNode {
        const { value, label } = this.props;

        return (
            <Checkbox
                style={this.props.style}
                checked={value}
                onChange={this.handleChange}>
                {label}
            </Checkbox>
        );
    }
}
