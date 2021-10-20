import { type } from 'os';
import React, { PureComponent } from 'react'
import DropDown from '../drop-down/DropDown'
import './style.scss';

interface ICellDropDownProps {
    data: any,
    filter?: ({ value, dataSource, rowData, }: { value: any, dataSource: any[] | null, rowData: any }) => [];
    parentExpr?: string,
    onValueChanged?: (value: any) => void;
    columns?: Col[];
    valueExpr?: string;
    displayExpr?: string;
    dataSource?: any[];
    selectMode?: 'single' | 'multiple' | null;
    pickAndClose?: boolean;
}
type Col = {
    dataField?: string;
    caption?: string;
}
interface ICellDropDownState {
    currentValue: string[] | null;
    dataSource: any[] | null;
}

export class CellDropDown extends PureComponent<ICellDropDownProps, ICellDropDownState> {
    private initColumns: Col[] = [
        {
            caption: 'Mã',
            dataField: 'Ma'
        },
        {
            caption: 'Tên',
            dataField: 'Ten'
        }
    ]
    constructor(props) {
        super(props)

        this.state = {
            currentValue: props.data.value,
            dataSource: props.data.column.lookup.dataSource
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Object.entries(this.props).forEach(([key, val]) =>
          prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
          Object.entries(this.state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
          );
        }
    }


    componentDidMount() {
        this.handleFilterValue();
    }

    handleValueChanged = (value) => {
        const { onValueChanged } = this.props
        this.props.data.setValue(value);
        this.setState({ currentValue: value });
        typeof onValueChanged === 'function' && onValueChanged(value);
    }
    handleFilterValue = () => {
        const { filter, data: { value } } = this.props
        const { dataSource } = this.state
        if (typeof filter === 'function') {
            const newSource = filter({ value, dataSource, rowData: this.props.data.data });
            this.setState({ dataSource: newSource });
        }
    }


    setToNull = () => {
        this.setState({ currentValue: null })
    }

    render() {
        const { columns = this.initColumns, valueExpr = 'Id', displayExpr = 'Ten', pickAndClose = false } = this.props
        const { currentValue, dataSource } = this.state;
        return (
            <DropDown
                pickAndClose={pickAndClose}
                value={currentValue}
                onValueChanged={this.handleValueChanged}
                dataSource={this.props.dataSource || dataSource}
                valueExpr={valueExpr}
                displayExpr={displayExpr}
                selectMode={this.props.selectMode || 'single'}
                parentExpr={this.props.parentExpr}
                columns={columns}
            />
        )
    }
}

export default CellDropDown
