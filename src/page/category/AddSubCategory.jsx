import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./category.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { GrPowerReset } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import { IoSearchOutline } from "react-icons/io5";

const AddSubCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryFilterData, setCategoryFilterData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [SubCategoryId, setSubCategoryId] = useState(null);
  const fileInputRef = useRef(null);

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSubCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/sub/category/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      setSubCategoryData(result);
      setCategoryFilterData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRow = (item) => {
    setCategoryName(item.category?.category_name);
    setSubCategoryName(item.subcategory_name);
    setImage(item.image);
    setSubCategoryId(item.id);
  };
  const handleReset = () => {
    setCategoryName("");
    setSubCategoryId(null);
    setSubCategoryName("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubCategory();
  }, []);
  console.log(SubCategoryId);

  const handleSaveCategory = async () => {
    if (!CategoryName) {
      toast.dismiss();
      toast.warning("Don't empty field");
      return;
    }
    const formData = new FormData();
    formData.append("category_name", CategoryName);
    formData.append("subcategory_name", SubCategoryName);
    formData.append("image", image);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/save/sub/category/`,
        {
          method: "POST",

          body: formData, // Ensure body is JSON string
        }
      );
      if (response.ok) {
        toast.success("Category saved successfully");
        fetchSubCategory();
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
    if (!SubCategoryId) {
      toast.dismiss();
      toast.warning("Please first click edit button");
      return;
    }
    const formData = new FormData();
    formData.append("category_name", CategoryName);
    formData.append("subcategory_name", SubCategoryName);
    formData.append("image", image);
    formData.append("id", SubCategoryId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/Update/sub/category/`,
        {
          method: "PUT",

          body: formData,
        }
      );
      if (response.ok) {
        toast.success("Category Upadte successfully");
        fetchSubCategory();
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
      "Are you sure you want to delete this sub category?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/sub/category/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Sub Category deleted successfully");
        fetchSubCategory();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Sub Category not deleted: ${errorData.message || "Unknown error"}`
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
        data.subcategory_name.toLowerCase().includes(searchValue)
      );
      setSubCategoryData(filter.length > 0 ? filter : categoryFilterData);
    }, 300); // Adjust the debounce delay as needed
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  return (
    <div>
      <Sidebar pageName="Add Sub Category" />
      <ToastContainer />
      <div className="container pt-2">
        <div className="card card-1 gap-3 d-flex align-items-center">
          <div className=" col-12 d-flex flex-md-row flex-column gap-2 align-items-center">
            <div className="d-flex col-12 gap-3 flex-column align-items-center">
              <div className=" col-lg-7 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
                <label className="col-lg-4 label" htmlFor="">
                  Category Name
                </label>
                <select
                  type="text"
                  className="form-control w-40 ml-2 "
                  placeholder="write the catgeory name"
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={CategoryName}
                  required
                >
                  <option>Select a category</option>
                  {categoryData &&
                    categoryData.map((data) => (
                      <option>{data.category_name}</option>
                    ))}
                </select>
              </div>
              <div className=" col-lg-7 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
                <label className="col-lg-4 label" htmlFor="">
                  Sub Category Name
                </label>
                <input
                  type="text"
                  className="form-control w-40 ml-2 "
                  placeholder="write the catgeory name"
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  value={SubCategoryName}
                  required
                />
              </div>
              <div className=" col-lg-7 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
                <label className="col-lg-4 label" htmlFor="">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control w-40 ml-2 "
                  placeholder="write the catgeory name"
                  onChange={handleFileChange}
                  accept="image/*"
                  ref={fileInputRef}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center mt-3 gap-3">
            {!SubCategoryId ? (
              <button
                className="save_button btn btn-primary"
                onClick={handleSaveCategory}
              >
                <FaSave size={20} />
                Save
              </button>
            ) : (
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
              placeholder="search sub category"
              onChange={handleSearch}
            />
            <button className="search_button">
              <IoSearchOutline size={20} color="white" />
            </button>
          </div>
        </div>
        <div className="card card-subcategory">
          <table className=" table table-hover table-sm table-responsive table-bordered">
            <thead>
              <tr>
                <th>Serial</th>
                <th>Category </th>
                <th>Sub Category </th>
                <th>Image </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subCategoryData &&
                subCategoryData.map((data, index) => (
                  <tr
                    className={`${
                      data.id === SubCategoryId ? "table-active" : ""
                    } `}
                  >
                    <td>{index + 1}</td>
                    <td>{data.category?.category_name}</td>
                    <td>{data.subcategory_name}</td>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_ClOUD}${data.image}`}
                        width={50}
                        alt=""
                      />
                    </td>
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

export default AddSubCategory;
