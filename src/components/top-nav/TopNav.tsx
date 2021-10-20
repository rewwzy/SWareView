import React from 'react'
import { NavLink } from 'react-router-dom';
import './TopNav.scss';
export type NavBarType = {
    text?: string;
    path?: string;
    icon?: string;
    items?: NavBarType[];
}

export type Props = {
    dataSource: NavBarType[];
}

function TopNav(props: Props) {
    return (
        <nav className='top-nav'>
            <li className="top-nav__home-item">
                <NavLink activeClassName="active" to='/home'>
                    <i className="fas fa-home"></i>
                </NavLink>
            </li>
            {
                props.dataSource && props.dataSource.map((item, index) => <li className='top-nav__item' key={item.text}>
                    <span>{index + 1}. {item.text}</span>
                    {item.items?.length && <i className="fas fa-sort-down"></i>}
                    <ul className='top-nav__sub-nav'>
                        {
                            item.items?.length && item.items.map((subItem, subIndex) => (
                                <li className='top-nav__sub-item' key={subItem.text}>
                                    <NavLink activeClassName="active" className='top-nav__sub-link' to={subItem.path}>{subIndex + 1}. {subItem.text}</NavLink>
                                </li>
                            ))
                        }

                    </ul>
                </li>)
            }
        </nav>
    )
}

export default TopNav
