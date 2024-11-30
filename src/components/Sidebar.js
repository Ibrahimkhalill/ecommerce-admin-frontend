import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

import { useLocation } from "react-router-dom";
import { useAuth } from "../page/authentication/Auth";

import "./sidebar.css";

const Nav = styled.div`
  background: #f85606;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 0.5rem;
  font-size: 2rem;
  // height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #f85606;
  width: 200px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = (props) => {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();

  //const [pageName, setpageName] = useState(JSON.stringify(localStorage.getItem('current_page_name')));
  useEffect(() => {
    setSidebar(false);
  }, [location.pathname]);

  const { logout } = useAuth();

  const showSidebar = () => setSidebar(!sidebar);
  const userRole = localStorage.getItem("role");

  // Filter SidebarData based on the user's role
  const filteredSidebarData = SidebarData.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const role = localStorage.getItem("role");
  // const tick = () => {
  //   setTime(new Date());
  // };

  // useEffect(() => {
  //   setInterval(tick, 1000);
  // }, []);
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav className="Nav">
          <div>
            <NavIcon to="#">
              <FaIcons.FaBars onClick={showSidebar} />
            </NavIcon>
          </div>

          <div
            className="header fs-5"
            style={{
              color: "white",
            }}
          >
            {/* MerinaSoft Computer Software */}
            {props.pageName}
          </div>
          {/* <div style={{color:"green", fontSize:"1vw", fontWeight:"bold", width:"25vw", marginRight:"20vw"}}></div>
          <div style={{color:"white", width:"12vw", marginRight:"6vw"}}>{time.toLocaleTimeString()}</div>
          <div style={{color:"white", width:"12vw", marginRight:"4vw"}}>{time.toISOString().slice(0, 10)}</div> */}

          <div
            style={{ color: "white", marginRight: "1vw", cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </div>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {filteredSidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
