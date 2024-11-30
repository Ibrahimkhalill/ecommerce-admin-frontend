import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
// import { FcBullish } from "react-icons/fc";
import { FaUserPlus } from "react-icons/fa";
import { MdSupervisedUserCircle } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { TbWindow } from "react-icons/tb";
import { FaMosquitoNet } from "react-icons/fa6";
import { BiSolidDollarCircle } from "react-icons/bi";
import { LiaFileInvoiceSolid } from "react-icons/lia"; //Quotation
import { IoIosMail } from "react-icons/io";
import { FaSquarePhone } from "react-icons/fa6";
import { FaDisplay } from "react-icons/fa6";

export const SidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],
  },
  {
    title: "Dashboard",
    path: "/user-dashboard",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["User"],
  },
  {
    title: "Customer",
    icon: <ImProfile />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["User"],

    subNav: [
      {
        title: "My Customer",
        path: "/my-customer",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Add Customer",
        path: "/customer/add-customer",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },

  {
    title: "Product",
    icon: <FaUserPlus />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],
    subNav: [
      {
        title: "Add product",
        path: "/add-product",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Manage product",
        path: "/manage-product",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Stock",
    path: "/view-stock",
    icon: (
      <>
        <MdSupervisedUserCircle />
      </>
    ),
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],
  },
  {
    title: "Category",
    icon: <FaUserPlus />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],
    subNav: [
      {
        title: "Add Category",
        path: "/add-category",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Add Sub-Category",
        path: "/add-sub-category",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Order",
    icon: <ImProfile />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Manage Order",
        path: "/manage-order",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Brand",
    icon: <TbWindow />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Add Brand",
        path: "/add-brand",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Material",
    icon: <FaMosquitoNet />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Add Material",
        path: "/add-material",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },

  {
    title: "Color",
    icon: <BiSolidDollarCircle />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Add Color",
        path: "/add-color",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Size",
    icon: <IoIosMail />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Add Size",
        path: "/add-size",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Diplay Slider",
    icon: <FaDisplay />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Add Display Image",
        path: "/display-slider",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Q & A",
    icon: <FaSquarePhone />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedRoles: ["admin"],

    subNav: [
      {
        title: "Question & Answer",
        path: "/question-answer",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
];
