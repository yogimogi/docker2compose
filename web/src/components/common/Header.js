import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const activeStyle = { color: "red" };
  const style = { textDecoration: "none" };
  return (
    <nav>
      <NavLink exact style={style} activeStyle={activeStyle} to="/">
        Home
      </NavLink>
      {" | "}
      <NavLink style={style} activeStyle={activeStyle} to="/page1">
        AppServer1
      </NavLink>
      {" | "}
      <NavLink style={style} activeStyle={activeStyle} to="/page2">
        AppServer2
      </NavLink>
      {" | "}
      <NavLink style={style} activeStyle={activeStyle} to="/page3">
        RateLimiting
      </NavLink>
    </nav>
  );
};

export default Header;
