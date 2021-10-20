import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TreeList, {
  Paging,
  Column,
  Pager,
  Selection,
} from "devextreme-react/tree-list";
import { DropDownBox } from "devextreme-react";
import { FilterRow } from "devextreme-react/data-grid";

export class DropDownTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.dropDownOptions = {
      width: 500,
    };
    this.dropDownBoxRef = React.createRef();
    this.treeListRef = React.createRef();
    let value = props?.data?.value;
    this.state = {
      currentValue: value,
      isOpen: false,
    };
  }

  onSelectedRowKeysChange = (key) => {
    if (key) {
      this.props.data.setValue(key?.toString());
      this.setState({ currentValue: key });
    }
  };

  contentRender = () => {
    const {
      parent = "IdCha",
      columns = [
        { dataField: "Ma", caption: "Mã" },
        { dataField: "Ten", caption: "Tên" },
      ],
      selectMode = "single",
      pickAndClose = false,
    } = this.props;
    return (
      <TreeList
        keyExpr="Id"
        key="Id"
        showRowLines
        showBorders
        dataSource={this.lookUpData() || []}
        parentIdExpr={parent}
        height={300}
        selectedRowKeys={this.state.currentValue}
        onSelectedRowKeysChange={(e) => {
          this.onSelectedRowKeysChange(e);
          pickAndClose && this.setState({ isOpen: e.value });
        }

        }
        defaultFocusedRowKey={this.state.currentValue}
        ref={this.treeListRef}
      >
        {columns.map((col) => (
          <Column
            key={col.dataField}
            dataField={col.dataField}
            caption={col.caption}
          />
        ))}
        <FilterRow visible={true} />
        <Pager
          allowedPageSizes={[10, 20, 50]}
          visible
          showInfo
          showPageSizeSelector
        />
        <Paging enabled={true} defaultPageSize={10} />
        <Selection mode={selectMode} />
      </TreeList>
    );
  };
  onValueChanged = (e) => {
    const { value } = e;
    if (value) return;
    this.setState({ currentValue: [] });
    this.treeListRef.current.instance.option("focusedRowIndex", -1);
  };

  lookUpData = () => {
    const lookup = this.props.data.column.lookup;
    let { filterSource } = lookup;
    //console.log(filterSource, "filterSource");
    //console.log("my props: ", this.props.data.column.lookup);
    if (typeof filterSource === "function")
      return filterSource(this.props.data.data);
    return this.props.data.column.lookup.dataSource;
  };

  render() {
    const { displayExpr = "Ten" } = this.props;
    const { isOpen } = this.state;
    return (
      <>
        <DropDownBox
          ref={this.dropDownBoxRef}
          dropDownOptions={this.dropDownOptions}
          dataSource={this.lookUpData() || []}
          value={this.state.currentValue}
          displayExpr={displayExpr}
          valueExpr="Id"
          onValueChanged={this.onValueChanged}
          contentRender={this.contentRender}
          opened={isOpen}
          onOptionChanged={e => {
            if (e.name === 'opened') {
              this.setState({ isOpen: e.value })
            }
          }}
        ></DropDownBox>
      </>
    );
  }
}

DropDownTemplate.propTypes = {
  parent: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object),
  selectionMode: PropTypes.string,
  displayExpr: PropTypes.string,
};

export default DropDownTemplate;
