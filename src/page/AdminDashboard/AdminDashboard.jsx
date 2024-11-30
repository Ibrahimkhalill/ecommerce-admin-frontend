import React from "react";
import "./admindashboard.css";
// import { MdSupervisedUserCircle } from "react-icons/md";
// import { ImProfile } from "react-icons/im";
// import { TbWindow } from "react-icons/tb";
// import { FaMosquitoNet } from "react-icons/fa6";
// import { BiSolidDollarCircle } from "react-icons/bi";
// import { FaUsers } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { FaSquarePhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Users from "./group.png";
import Profile from "./profile.png";
import Window from "./window.png";
import Mosquto from "./mosquito.png";
import Dollar from "./dollar.png";
import Customer from "./customer.png";
import Email from "./email.png";
import Phone from "./phone.png";
const AdminDashboard = () => {
  return (
    <div className="container_full_div_modaweb">
      <span className="text_primary">Admin Dashboard</span>
      <div className="container_div_admin_dashboard">
        <div className="container_first_div_admin_dashboard">
          <div>
            <Link to={"/add-new-user"}>
              <div className="admin_dashboard_box1 animation_left">
                {/* <MdSupervisedUserCircle className="user-icon" /> */}
                <img src={Users} alt="" className="user-icon" />
                <span>User</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/profile"}>
              <div className="admin_dashboard_box1 animation_right">
                {/* <ImProfile className="user-icon" /> */}
                <img src={Profile} alt="" className="user-icon" />
                <span>Profile</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/glass-setup"}>
              <div className="admin_dashboard_box1 animation_left">
                {/* <TbWindow className="user-icon" /> */}
                <img src={Window} alt="" className="user-icon" />
                <span>Glass</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/mosquito-net"}>
              <div className="admin_dashboard_box1 animation_right">
                {/* <FaMosquitoNet className="user-icon" /> */}
                <img src={Mosquto} alt="" className="user-icon" />
                <span>Mosquito Net</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/vat-and-installtion"}>
              <div className="admin_dashboard_box1 animation_left">
                {/* <BiSolidDollarCircle className="user-icon" /> */}
                <img src={Dollar} alt="" className="user-icon" />
                <span className="fontSize">Vat & Installation</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/all-customer"}>
              <div className="admin_dashboard_box1 animation_right">
                {/* <FaUsers className="user-icon" /> */}
                <img src={Customer} alt="" className="user-icon" />
                <span>Customer</span>
              </div>
            </Link>
          </div>

          <div>
            <Link to={"/mail-data"}>
              <div className="admin_dashboard_box1 animation_left">
                {/* <MdEmail className="user-icon" /> */}
                <img src={Email} alt="" className="user-icon" />
                <span>Mail Data</span>
              </div>
            </Link>
          </div>
          <div>
            <Link to={"/phone-data"}>
              <div className="admin_dashboard_box1 animation_right">
                {/* <FaSquarePhone className="user-icon" /> */}
                <img src={Phone} alt="" className="user-icon" />
                <span>Phone Data</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
