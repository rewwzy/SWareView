import React from "react";
import "./styles.scss";
function PopupTitle({
  title,
  hidePopup,
}: {
  title: string;
  hidePopup: () => void;
}) {
  return (
    <div className="popup-title">
      <span>{title && title}</span>
      <div onClick={hidePopup}>
        {/* <i className="fas fa-times"></i> */}
        <i className="dx-icon dx-icon-close"></i>
      </div>
    </div>
  );
}

export default PopupTitle;
