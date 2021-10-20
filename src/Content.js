import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import TopNavLayout from "./layouts/top-nav-layout/TopNavLayout";
import { Footer } from "./components";

export default function Content() {
  const nav_type = useSelector((state) => state.layoutReducer.nav_type);
  console.log("nav_type : ", nav_type);
  if (nav_type === "vertical") {
    return (
      <SideNavBarLayout title={appInfo.title}>
        <Switch>
          {routes.map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
          <Redirect to={"/home"} />
        </Switch>
        <Footer>
          Copyright © 2021-{new Date().getFullYear()} {appInfo.company} Inc.{" "}
        </Footer>
      </SideNavBarLayout>
    );
  }
  return (
    <TopNavLayout appTitle={appInfo.title}>
      <div style={{ padding: 12 }}>
        <Switch>
          {routes.map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
          <Redirect to={"/home"} />
        </Switch>
        <Footer>
          Copyright © 2022-{new Date().getFullYear()} {appInfo.company} Inc.{" "}
        </Footer>
      </div>
    </TopNavLayout>
  );
}
