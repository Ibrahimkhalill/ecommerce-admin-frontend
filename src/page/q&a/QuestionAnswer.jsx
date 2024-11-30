import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./question_answer.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdBrowserUpdated } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { GrPowerReset } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import { IoSearchOutline } from "react-icons/io5";

const QuestionAnswer = () => {
  const [sizeData, setsizeData] = useState([]);
  const [sizeFilterData, setsizeFilterData] = useState([]);
  const [question, setquestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionAnswerId, setquestionAnswerId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/question_answer/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const result = await response.json();
      setsizeData(result);
      setsizeFilterData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRow = (item) => {
    setquestion(item.question);
    setAnswer(item.answer);
    setquestionAnswerId(item.id);
  };
  const handleReset = () => {
    setquestion("");
    setAnswer("");
    setquestionAnswerId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const handleUpdateQuestionAnswer = async () => {
    if (!questionAnswerId) {
      toast.dismiss();
      toast.warning("Please first click edit button");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/update/question_answer/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer: answer, id: questionAnswerId }),
        }
      );
      if (response.ok) {
        toast.success("Answer Updated successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(`Answer not upadte: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteCategory = async (id) => {
    // Show confirmation alert
    const confirmed = window.confirm(
      "Are you sure you want to delete this Row?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/question_answer/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Answer deleted successfully");
        fetchData();
        handleReset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Answer not deleted: ${errorData.message || "Unknown error"}`
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
      const filter = sizeFilterData.filter((data) =>
        data.product.name.toLowerCase().includes(searchValue)
      );
      setsizeData(filter);
    }, 300); // Adjust the debounce delay as needed
  };

  return (
    <div>
      <Sidebar pageName="Question & Answer" />
      <ToastContainer />
      <div className="container pt-2">
        <div className="card card-1 d-flex align-items-center gap-2">
          <div className=" col-lg-8 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
            <label className="col-lg-3 label" htmlFor="">
              Question
            </label>
            <input
              type="text"
              className="form-control w-40 ml-2 "
              placeholder="write the size name"
              value={question}
            />
          </div>
          <div className=" col-lg-8 col-12 d-flex flex-column flex-lg-row gap-3 align-items-start align-md-items-center justify-content-center">
            <label className="col-lg-3 label" htmlFor="">
              Answer<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control w-40 ml-2 "
              placeholder="write the size name"
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
            />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center mt-3 gap-3">
            <button
              className="save_button btn btn-success"
              onClick={handleUpdateQuestionAnswer}
            >
              <RxUpdate size={20} /> Update
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
        <div className="card flex  align-items-center justify-content-center p-3 mt-1">
          <div className="search_input col-md-6 d-flex  align-items-center justify-content-center ">
            <input
              type="text"
              className="form-control"
              placeholder="search product"
              onChange={handleSearch}
            />
            <button className="search_button">
              <IoSearchOutline size={20} color="white" />
            </button>
          </div>
        </div>
        <div className="card card-3">
          <table className=" table  table-sm table-responsive table-bordered">
            <thead>
              <tr>
                <th>Serial</th>
                <th>User</th>
                <th>Product</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sizeData &&
                sizeData.map((data, index) => (
                  <tr
                    className={`${
                      data.id === questionAnswerId ? "table-active" : ""
                    } `}
                  >
                    <td>{index + 1}</td>
                    <td>{data.user?.username}</td>
                    <td>{data.product?.name}</td>
                    <td>{data.question}</td>
                    <td>{data.answer}</td>
                    <td>{data.createAt.split('T')[0]} </td>
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

export default QuestionAnswer;
