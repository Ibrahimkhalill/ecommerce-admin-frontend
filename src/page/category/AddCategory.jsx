import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./category.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdBrowserUpdated } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { GrPowerReset } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import { IoSearchOutline } from "react-icons/io5";

const AddCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryFilterData, setCategoryFilterData] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryId, setCategoryId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/category/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      setCategoryData(result);
      setCategoryFilterData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRow = (item) => {
    setCategoryName(item.category_name);
    setCategoryId(item.id);
  };
  const handleReset = () => {
    setCategoryName("");
    setCategoryId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async () => {
    if (!CategoryName) {
      toast.dismiss();
      toast.warning("Don't empty field");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/save/category/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category_name: CategoryName }), // Ensure body is JSON string
        }
      );
      if (response.ok) {
        toast.success("Category saved successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json(); // Get response error details
        toast.error(
          `Category not saved: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };
  const handleUpdateCategory = async () => {
    if (!CategoryId) {
      toast.dismiss();
      toast.warning("Please first click edit button");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/update/category/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category_name: CategoryName, id: CategoryId }),
        }
      );
      if (response.ok) {
        toast.success("Category Upadte successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Category not upadte: ${errorData.message || "Unknown error"}`
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
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/category/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Category deleted successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Category not deleted: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };

  //
  let debounceTimer;
  const handleSearch = (e) => {
    clearTimeout(debounceTimer);
    const searchValue = e.target.value.toLowerCase();
    
    debounceTimer = setTimeout(() => {
      const filter = categoryFilterData.filter((data) =>
        data.category_name.toLowerCase().includes(searchValue)
      );
      setCategoryData(filter.length > 0 ? filter : categoryFilterData);
    }, 300); // Adjust the debounce delay as needed
  };
  

  return (
    <div>
      <Sidebar pageName="Add Category"/>
      <ToastContainer />
      <div className="container pt-2">
        <div className="card card-1 d-flex align-items-center">
          <div className=" col-lg-8 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
            <label className="col-lg-3 label" htmlFor="">
              Category Name
            </label>
            <input
              type="text"
              className="form-control w-40 ml-2 "
              placeholder="write the catgeory name"
              onChange={(e) => setCategoryName(e.target.value)}
              value={CategoryName}
            />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center mt-3 gap-3">
            {!CategoryId ? (

            <button
              className="save_button btn btn-primary"
              onClick={handleSaveCategory}
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
              placeholder="search category"
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
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryData &&
                categoryData.map((data, index) => (
                  <tr
                    className={`${
                      data.id === CategoryId ? "table-active" : ""
                    } `}
                  >
                    <td>{index + 1}</td>
                    <td>{data.category_name}</td>
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

export default AddCategory;
