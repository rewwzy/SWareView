import { DropDownBox, TreeList } from "devextreme-react";
import { Column, FilterRow, Selection } from "devextreme-react/tree-list";
import React, { Component } from "react";
import _ from "lodash";
export class DropDownTreeList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    let propsValue = _.isArray(props.value)
      ? props.value
      : typeof props.value === "string"
      ? props.value?.split(",")
      : null;
    this.state = {
      value: propsValue || null,
    };
  }
  onSelectionChanged = ({ selectedRowKeys }) => {
    const { onValueChanged = (e) => undefined } = this.props;
    this.setState({ value: selectedRowKeys });
    onValueChanged(selectedRowKeys);
  };
  onFocusedRowChanged = (e) => {
    this.setState((state, props) => {
      return { selected: e.selectedRowKeys };
    });
  };

  treeListRender = () => {
    const { value, selected } = this.state;
    const {
      columns = [
        { dataField: "Ma", caption: "Mã", width: 140 },
        { dataField: "Ten", caption: "Tên" },
      ],
      dataSource = [],
      mode = "single",
      parentIdExpr = "IdCha",
    } = this.props;
    return (
      <TreeList
        ref={(ref) => (this.treeRef = ref)}
        keyExpr="Id"
        dataSource={dataSource}
        showBorders
        showRowLines
        parentIdExpr={parentIdExpr}
        focusedRowEnabled
        selectedRowKeys={value}
        onSelectionChanged={this.onSelectionChanged}
        onFocusedRowChanged={this.onFocusedRowChanged}
        focusedRowIndex={selected}
        height={300}
      >
        {columns.map((col, index) => (
          <Column {...col} key={index} />
        ))}

        <Selection mode={mode} recursive />
        <FilterRow visible />
      </TreeList>
    );
  };
  render() {
    const {
      dataSource = [],
      onValueChanged = (e) => null,
      dref,
      onFocusIn = (e) => null,
      valueExpr = "Id",
      displayExpr = "Ten",
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <DropDownBox
          dataSource={dataSource}
          valueExpr={valueExpr}
          ref={dref}
          displayExpr={displayExpr}
          contentRender={this.treeListRender}
          showClearButton
          onValueChanged={(e) => {
            if (!e.value) {
              this.setState({ value: null });
              onValueChanged(null);
              this.treeRef?.instance?.option("focusedRowIndex", -1);
            }
          }}
          onFocusIn={(e) => onFocusIn(e)}
          value={value}
        />
      </div>
    );
  }
}

export default DropDownTreeList;
