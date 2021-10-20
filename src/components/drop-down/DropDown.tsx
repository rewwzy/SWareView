import { DropDownBox, TreeList } from "devextreme-react";
import {
  Column,
  FilterRow,
  Scrolling,
  Selection,
} from "devextreme-react/tree-list";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";

type Col = {
  dataField?: string;
  caption?: string;
};

type Props = {
  onValueChanged?: (value: string[] | null) => void;
  dataSource: any[];
  columns: Col[];
  selectMode?: "single" | "multiple";
  valueExpr: string;
  displayExpr: string;
  value?: string[] | null;
  parentExpr?: string;
  pickAndClose?: boolean;
  disabled?: boolean;
  showClearButton?: boolean;
};

function DropDown(props: Props) {
  const [open, setOpen] = useState(false);
  const onValueChanged = (value) => {
    typeof props.onValueChanged === "function" && props.onValueChanged(value);
  };
  return (
    <div>
      <DropDownBox
        dropDownOptions={{ minWidth: "500px" }}
        dataSource={props.dataSource}
        valueExpr={props.valueExpr}
        displayExpr={props.displayExpr}
        value={props.value}
        opened={open}
        onOptionChanged={(e) => {
          if (e.name === "opened") {
            setOpen(e.value);
          }
        }}
        showDropDownButton={true}
        onValueChanged={(e) => {
          onValueChanged(e.value);
        }}
        disabled={props.disabled || false}
        showClearButton={props.showClearButton}
        contentRender={(e) => {
          if (props.parentExpr) {
            return (
              <TreeList
                height={260}
                dataSource={props.dataSource}
                keyExpr={props.valueExpr}
                onSelectionChanged={(e) => {
                  onValueChanged(e.selectedRowKeys);
                  props.pickAndClose && setOpen(false);
                }}
                showBorders
                showRowLines
                selectedRowKeys={props.value}
                parentIdExpr={props.parentExpr}
              >
                <Scrolling mode="virtual" />

                <Selection mode={props.selectMode || "single"} />
                <FilterRow visible={true} />
                {props.columns.map((col, index) => (
                  <Column
                    key={index}
                    dataField={col.dataField}
                    caption={col.caption}
                  />
                ))}
              </TreeList>
            );
          }
          return (
            <TreeList
              height={260}
              dataSource={props.dataSource}
              keyExpr={props.valueExpr}
              onSelectionChanged={(e) => {
                onValueChanged(e.selectedRowKeys);
                props.pickAndClose && setOpen(false);
              }}
              showBorders
              showRowLines
              selectedRowKeys={
                props.value
                  ? _.isArray(props.value)
                    ? props.value
                    : [props.value]
                  : null
              }
            >
              <Selection mode={props.selectMode || "single"} />
              <FilterRow visible={true} />
              {props.columns.map((col, index) => (
                <Column
                  key={index}
                  dataField={col.dataField}
                  caption={col.caption}
                />
              ))}
              <Scrolling mode="virtual" />
            </TreeList>
          );
        }}
      />
    </div>
  );
}

export default React.memo(DropDown);
