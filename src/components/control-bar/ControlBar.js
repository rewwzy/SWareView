import { Button } from "devextreme-react";
import React, { Component } from "react";
import "./ControlBar.scss";
import { ssoApi } from "../../services/http";
import qS from "query-string";

export const type = {
  ADD: "add",
  EDIT: "edit",
  DEL: "del",
  PRINT: "print",
};

window.arrayButton = [
  {
    text: "Xem",
    icon: "search",
    key: "READ",
    visible: false,
  },
  {
    text: "Thêm",
    icon: "plus",
    key: "CREATE",
    visible: true,
  },
  {
    text: "Sửa",
    icon: "edit",
    key: "EDIT",
    visible: true,
  },
  {
    text: "Xoá",
    icon: "clear",
    key: "DELETE",
    visible: true,
  },
  {
    text: "Lưu",
    icon: "save",
    key: "SAVE",
    visible: false,
  },
  {
    text: "Gửi",
    icon: "todo",
    key: "PAY",
    visible: false,
  },
  {
    text: "In",
    icon: "print",
    key: "PRINT",
    visible: false,
  },
  {
    text: "Gia hạn",
    icon: "range",
    key: "SEARCH",
    visible: false,
  },
  {
    text: "Sao chép",
    icon: "copy",
    key: "COPY",
    visible: false,
  },
  {
    text: "Quay lại",
    icon: "undo",
    key: "PUBLIC",
    visible: false,
  },
  {
    text: "Điều chỉnh",
    icon: "range",
    key: "DIEUCHINH",
    visible: false,
  },
];

export class ControlBar extends Component {
  constructor(props) {
    super(props);

    this.state = { arrayButton: window.arrayButton };
  }
  componentDidMount() {
    const { arrayButton } = this.state;
    const { phanHe,  } = this.props;
    ssoApi
      .get("/User/GetButton?" + qS.stringify({ path: phanHe }))
      .then((res) => {
        const buttons = res.data;
        const arrNew = arrayButton.map((item) => {
          const condition = buttons.some((_item) => _item.text === item.text);
          if (condition) return { ...item, visible: true };
          return { ...item, visible: false };
        });

        window.arrayButton = arrNew;
        this.setState({
          arrayButton: arrNew,
        });
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  }
  render() {
    const { onClick, disableButtons = [] } = this.props;
    const { arrayButton,  } = this.state;
    return (
      <div className="control-bar">
        {arrayButton.map((value) => (
          <Button
            className="control-bar__button"
            id={value.key}
            key={value.key}
            text={value.text}
            style={{ background: "#3b7b9e", fontWeight: "500", color: "#eee" }}
            visible={value.visible}
            disabled={disableButtons.includes(value.key)}
            icon={value.icon}
            onClick={() =>
              typeof onClick === "function" && onClick({ mode: value.key, disabled: disableButtons.includes(value.key) })
            }
          />
        ))}
      </div>
    );
  }
}

export default ControlBar;
