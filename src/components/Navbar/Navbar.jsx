import React, { useState } from "react";
import style from "./navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { BiSolidPhoneCall } from "react-icons/bi";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  //drawer function:
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className={style.navbar_wrapper}>
      <div className={style.navbar_main}>
        {/*============ hambarger_div =======*/}
        <div className={style.hambarger_div}>
          <div className={style.hambarger} onClick={showDrawer}>
            <GiHamburgerMenu className={style.hamberger_icon} />{" "}
          </div>
        </div>
        {/*============ logo_div =======*/}
        <div className={style.logo_div}>
          <h2 className={style.logo}>Moda Window and Doors</h2>
        </div>
      </div>

      {/*=============== drawer=================== */}
      <div className={style.drawerWrapper}>
        <div className={style.drawer}>
          <Drawer
            // title={<span style={{ color: "white" }}>CATEGORIES</span>}
            placement="left"
            closable={true}
            onClose={onClose}
            visible={visible}
            width={140}
            style={{ backgroundColor: "#9e9e9e" }}
            closeIcon={
              <CloseOutlined
                style={{
                  position: "absolute",
                  top: "0",
                  right: "60px",
                  color: "white",
                  fontSize: "1.5rem",
                }}
              />
            }
          >
            {/* <div className={style.drawer_categories}>data</div> */}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
