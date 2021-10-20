import React from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { useSelector, useDispatch } from "react-redux";
import { changedNavType } from "../../redux/layout/slice";
import Button from "devextreme-react/button";
import UserPanel from "../user-panel/user-panel";
import "./header.scss";
import { Template } from "devextreme-react/core/template";
const Header = ({ menuToggleEnabled, title, toggleMenu }) => {
  const nav_type = useSelector((state) => state.layoutReducer.nav_type);
  const dispatch = useDispatch();
  return (
    <header className={"header-component"}>
      <Toolbar className={"header-toolbar"}>
        <Item
          visible={menuToggleEnabled}
          location={"before"}
          widget={"dxButton"}
          cssClass={"menu-button"}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item>
        <Item
          location={"before"}
          cssClass={"header-title"}
          text={title}
          visible={!!title}
        />
        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
        >
          <Button
            className={"user-button authorization"}
            // width={210}
            height={"100%"}
            stylingMode={"text"}
          >
            <UserPanel menuMode={"context"} />
          </Button>
        </Item>
        <Template name={"userPanelTemplate"}>
          <UserPanel menuMode={"list"} />
        </Template>
        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
        >
          {/* <button
            className="btn-changed-mode"
            onClick={() =>
              dispatch(
                changedNavType(
                  nav_type === "vertical" ? "horizontal" : "vertical"
                )
              )
            }
          >
            {nav_type === "vertical" ? "Dọc" : "Ngang"}
          </button> */}
        </Item>
      </Toolbar>
    </header>
  );
};

export default Header;
