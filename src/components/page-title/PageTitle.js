import React from "react";
import "./PageTitle.scss";
function PageTitle({ title }) {
  return (
    <div className="page-title">
      <span className="title">{title && title}</span>
    </div>
  );
}

export default React.memo(PageTitle);
