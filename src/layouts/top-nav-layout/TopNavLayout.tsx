import React from 'react'
import { navigation } from '../../app-navigation';
import { Footer, Header } from '../../components';
import TopNav from '../../components/top-nav/TopNav';

function TopNavLayout({ children, appTitle }) {
    return (
        <div>
            <Header
                toggleMenu={false}
                menuToggleEnabled
                title={appTitle}
            />
            <div>
                <TopNav dataSource={navigation} />
            </div>
            {
                React.Children.map(children, item => {
                    return item.type !== Footer && item;
                })
            }
        </div>
    )
}

export default TopNavLayout
