import { Button, Popup } from "devextreme-react";
import React from "react";
import "./PopupTemplate.scss";
function PopupTemplate({
  visible,
  okText = "Có",
  cancelText = "Không",
  onOk,
  onCancel,
  title = "Bạn có thực sự muốn xoá?",
  type = "YesNo"
}) {
  return (
    <>
      <Popup
        className="popupcontainer"
        visible={visible}
        showTitle={false}
        width={240}
        height={120}
      >
        <div className="popuptemplate-title">
          <span>{title}</span>
        </div>
        <div className="popuptemplate-btn-control">
          <Button
            text={okText}
            accessKey={"enter"}
            onClick={(e) => {
              if (typeof onOk === "function") onOk(e);
            }}
            visible={type === 'YesNo' ? true : false}
          />
          <Button
            text={cancelText}
            accessKey={"esc"}
            onClick={(e) => {
              if (typeof onCancel === "function") onCancel(e);
            }}
          />
        </div>
      </Popup>
    </>
  );
}

export default PopupTemplate;
