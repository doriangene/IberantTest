
import * as React from 'react';
import { InputNumber } from 'antd';

interface ICurrencyInputProps {
    currencySymbol?: string;
    value?: number;
    min?: number;
    max?: number;
    onChange?: (e: number) => void;
    onBlur?: () => void;
}

interface ICurrencyInputState {

}

export default class CurrencyInput extends React.Component<ICurrencyInputProps, ICurrencyInputState>{

    render() {

        const symbol = this.props.currencySymbol || "€";
        const pattern = `${symbol}\s?|(,*)`

        return <InputNumber
            min={this.props.min}
            step={0.05}
            style={{width: '100%'}}
            //formatter={(value) => `${value}${symbol}`}
            //parser={(value) => { const v = Number(value.replace(symbol, '').trim()); return isNaN(v) ? 0 : v; }}
            value={this.props.value}
            precision={2}
            onBlur={() => {
                if(this.props.onBlur)
                    this.props.onBlur();
            } }
            onChange={this.props.onChange as any}
        />;
    }
}
