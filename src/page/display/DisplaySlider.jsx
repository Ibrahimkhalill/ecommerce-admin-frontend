import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./display_slider.css";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";

const DisplaySlider = () => {
  const [displaySliderData, setdisplaySliderData] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/display-slider/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      setdisplaySliderData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReset = () => {
    setImagePreview("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async () => {
    setLoading(true);
    if (!image) {
      toast.dismiss();
      toast.warning("Don't empty field");
      setLoading(false);
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5 MB. Please upload a smaller image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("image", image);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/save/display-slider/`,
        {
          method: "POST",
          body: formData, // Ensure body is JSON string
        }
      );
      if (response.ok) {
        toast.success("Display Image saved successfully");
        handleReset();
        fetchData();
        setLoading(false);
      } else {
        const errorData = await response.json(); // Get response error details
        toast.error(
          `Category not saved: ${errorData.message || "Unknown error"}`
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDisplaySlider = async (id) => {
    // Show confirmation alert
    const confirmed = window.confirm(
      "Are you sure you want to delete this Display Image?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/display-slider/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Display Image deleted successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Display Image not deleted: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };

  //

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set the preview to FileReader's result
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    }
  };

  return (
    <div>
      <Sidebar pageName="Add Display Image" />
      <ToastContainer />
      <div className="container pt-2">
        <div className="card input_card d-flex col-md-12 align-items-center ">
          <div className="d-flex flex-column col-md-8">
            <div className=" col-12 d-flex flex-md-row flex-column gap-2 ">
              <div className="d-flex col-12 gap-3 flex-row align-items-center">
                <label className="col-lg-4 label" htmlFor="image">
                  Image
                </label>
                <input
                  id="image"
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
            <div className="col-md-12 d-flex align-items-center justify-content-center  mt-3 gap-3">
              <button
                className="save_button btn btn-primary"
                onClick={handleSaveCategory}
              >
                {loading ? (
                  <span className="loader_loading"></span>
                ) : (
                  <>
                    <FaSave size={20} />
                    <span>Save</span>
                  </>
                )}
              </button>

              <button
                className="save_button btn btn-secondary"
                onClick={handleReset}
              >
                <GrPowerReset size={20} />
                Reset
              </button>
            </div>
          </div>
          <div className="card col-md-3 image_preview_box">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="image_preview" />
            ) : (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAwm5b7x7MIs4curvY6G94PKiyQB8-gBONg&s"
                alt=""
                className="image_preview_icon"
              />
            )}
          </div>
        </div>

        <div className="card card-subcategory">
          <table className=" table table-hover table-sm table-responsive table-bordered">
            <thead>
              <tr>
                <th>Serial</th>

                <th>Image </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displaySliderData &&
                displaySliderData.map((data, index) => (
                  <tr>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={`${process.env.REACT_APP_ClOUD}${data.image}`}
                        style={{ width: "500px", height: "100px" }}
                        alt=""
                      />
                    </td>
                    <td>
                      <button
                        className="edit_button"
                        onClick={() => handleDeleteDisplaySlider(data.id)}
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

export default DisplaySlider;
