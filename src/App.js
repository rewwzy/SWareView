import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import "./common-style.scss";
import "react-notifications/lib/notifications.css";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";
import { getCookieValue } from "./utils/cookie-store";
import vn from "./vi.json";
import { locale, loadMessages } from "devextreme/localization";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import moment from "moment";

function App() {
  const { user, loading } = useAuth();
  useEffect(() => {
    //const access_token = getCookieValue("access-token");
    //if (!access_token) window.location.replace(process.env.REACT_APP_ROOT_URL);
    loadMessages(vn);
    locale("vi");
  }, []);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function () {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
            <NotificationContainer />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

Date.prototype.toJSON = function () {
  return moment(this).format();
};
