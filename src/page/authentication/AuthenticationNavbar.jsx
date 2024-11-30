import { Link, useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";


import "./login.css";

function AuthenticationNavbar() {
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname;

  const handleActive = (name) => {
    if (name === "login") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <div className="hero_area">
        <header className="header_section">
          <div className="">
            <nav className=" responsive_authentication_navbar ">
              <Link to={"/"}>
                <div>
                  <span className="mr-2">
                    <IoIosArrowBack size={27} />
                  </span>
                  Login / Signup
                </div>
              </Link>
            </nav>
          </div>
        </header>
      </div>

      <div className="responsive_search pl-0 d-mdx-block d-lg-none">
        <div className="mod_tabs_header">
          <div
            className={`${
              path === "/login" ? "active_link_authen" : "list_header_auten"
            }`}
          >
            <button onClick={() => handleActive("login")}>LOGIN</button>
          </div>
          <div
            className={`${
              path === "/signup" ? "active_link_authen" : "list_header_auten"
            }`}
          >
            <button onClick={() => handleActive("signup")}>SIGNUP</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthenticationNavbar;
