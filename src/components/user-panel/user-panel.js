import React, { useMemo } from 'react';
import { useHistory } from "react-router-dom";
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import './user-panel.scss';

export default function ({ menuMode }) {
  const { user, signOut } = useAuth();
  const history = useHistory();

  function navigateToProfile() {
    history.push("/profile");
  }

  const menuItems = useMemo(() => ([
    {
      text: 'Profile',
      icon: 'user',
      //onClick: navigateToProfile
    },
    {
      text: 'Logout',
      icon: 'runner',
      //onClick: signOut
      onClick: () => {
        document.cookie = 'access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = process.env.REACT_APP_ROOT_URL;
      }
    }
  ]), [signOut]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'user-name'}>{user.email}</div>
        <div className={'image-container'}>
          <div
            style={{
              background: `url(${user.avatarUrl}) no-repeat #fff`,
              backgroundSize: 'cover'
            }}
            className={'user-image'} />
        </div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={210}
          cssClass={'user-menu'}
        >
          <Position my={'top center'} at={'bottom center'} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}
