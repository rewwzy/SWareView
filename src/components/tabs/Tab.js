import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "./Tab.scss";
export class Tab extends PureComponent {
  state = {
    activeTab: 0,
  };
  onTabClick = (e) => {
    const { onTabChanged } = this.props;
    typeof onTabChanged === "function" && onTabChanged(e);
    this.setState({ activeTab: e.tab });
  };
  render() {
    const { items } = this.props;
    const { activeTab } = this.state;
    return (
      <div className="tab-container">
        <div className="tab-header">
          {items?.length &&
            items.map((item) => (
              <HeaderItem
                onClick={this.onTabClick}
                key={item.key}
                item={item}
                isActive={item.index === activeTab ? true : false}
              />
            ))}
        </div>
        <div className="tab-content">
          {React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
              const el = React.cloneElement(child, { activeTab });
              return el;
            }
            return child;
          })}
        </div>
      </div>
    );
  }
}
Tab.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      title: PropTypes.string,
      key: PropTypes.any,
    })
  ).isRequired,
  onTabChanged: PropTypes.func,
};
export class Item extends PureComponent {
  render() {
    const { index, activeTab } = this.props;
    return (
      <div className={`item ${activeTab === index ? "active" : ""}`}>
        {this.props.children}
      </div>
    );
  }
}
export class HeaderItem extends PureComponent {
  render() {
    const { item, isActive, onClick } = this.props;
    return (
      <div
        className={`header-item ${isActive ? "active" : ""}`}
        onClick={(e) => {
          typeof onClick === "function" &&
            onClick({ event: e, tab: item.index });
        }}
      >
        {item.title}
      </div>
    );
  }
}
Tab.Item = Item;

export default Tab;
