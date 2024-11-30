import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./add_color.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdBrowserUpdated } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { GrPowerReset } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import { IoSearchOutline } from "react-icons/io5";

const AddColor = () => {
  const [colorData, setcolorData] = useState([]);
  const [colorFilterData, setcolorFilterData] = useState([]);
  const [colorName, setcolorName] = useState("");
  const [colorId, setcolorId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/color/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      setcolorData(result);
      setcolorFilterData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRow = (item) => {
    setcolorName(item.name);
    setcolorId(item.id);
  };
  const handleReset = () => {
    setcolorName("");
    setcolorId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavecolor  = async () => {
    if (!colorName) {
      toast.dismiss();
      toast.warning("Don't empty field");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/save/color/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ color_name: colorName }), // Ensure body is JSON string
        }
      );
      if (response.ok) {
        toast.success("Color saved successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json(); // Get response error details
        toast.error(
          `Color not saved: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };
  const handleUpdateCategory = async () => {
    if (!colorId) {
      toast.dismiss();
      toast.warning("Please first click edit button");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/update/color/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ color_name: colorName, id: colorId }),
        }
      );
      if (response.ok) {
        toast.success("Color Upadte successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Color not upadte: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteCategory = async (id) => {
    // Show confirmation alert
    const confirmed = window.confirm(
      "Are you sure you want to delete this color?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/color/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Color deleted successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Color not deleted: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };

  //search
  let debounceTimer;
  const handleSearch = (e) => {
    clearTimeout(debounceTimer);
    const searchValue = e.target.value.toLowerCase();

    debounceTimer = setTimeout(() => {
      const filter = colorFilterData.filter((data) =>
        data.name.toLowerCase().includes(searchValue)
      );
      setcolorData(filter);
    }, 300); // Adjust the debounce delay as needed
  };

  return (
    <div>
      <Sidebar pageName="Add Color" />
      <ToastContainer />
      <div className="container pt-2">
        <div className="card card-1 d-flex align-items-center">
          <div className=" col-lg-8 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
            <label className="col-lg-3 label" htmlFor="">
              Color Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control w-40 ml-2 "
              placeholder="write the color name"
              onChange={(e) => setcolorName(e.target.value)}
              value={colorName}
            />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center mt-3 gap-3">
              {!colorId ? (
            <button
              className="save_button btn btn-primary"
              onClick={handleSavecolor }
            >
              <FaSave size={20} />
              Save
            </button>
              ):(
            <button
              className="save_button btn btn-success"
              onClick={handleUpdateCategory}
            >
              <RxUpdate size={20} /> Update
            </button>
              )}
            <button
              className="save_button btn btn-secondary"
              onClick={handleReset}
            >
              <GrPowerReset size={20} />
              Reset
            </button>
          </div>
        </div>
        <div className="card flex  align-items-center justify-content-center p-3 mt-1">
          <div className="search_input col-md-6 d-flex  align-items-center justify-content-center ">
            <input
              type="text"
              className=" form-control"
              placeholder="search color"
              onChange={handleSearch}
            />
            <button className="search_button">
              <IoSearchOutline size={20} color="white" />
            </button>
          </div>
        </div>
        <div className="card card-2">
          <table className=" table table-hover table-sm table-responsive table-bordered">
            <thead>
              <tr>
                <th>Serial</th>
                <th>color Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {colorData &&
                colorData.map((data, index) => (
                  <tr
                    className={`${data.id === colorId ? "table-active" : ""} `}
                  >
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>
                      <button
                        className=" edit_button"
                        onClick={() => handleRow(data)}
                      >
                        <FaEdit size={20} />
                      </button>{" "}
                      <button
                        className="edit_button"
                        onClick={() => handleDeleteCategory(data.id)}
                      >
                        <MdDelete size={20} color="red" />
                      </button>{" "}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddColor;
