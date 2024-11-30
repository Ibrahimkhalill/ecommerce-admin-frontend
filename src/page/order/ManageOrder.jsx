import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./manage_product.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { json, Link } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";

function ManageOrder() {
  const [orderData, setOrderData] = useState([]);
  const [ProductDetails, setProductDetails] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile_number, setMobile] = useState("");
  const [statusData, setStatusData] = useState([]);
  const [status, setStatus] = useState({});
  const [searchTransactioId, setSearchTransactionId] = useState("");

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/order/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const StatusAll = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/status/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const status = await StatusAll.json();
      const data = await response.json();
      setOrderData(data);
      setStatusData(status);
      setSearchTransactionId("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  const handleShowDeatils = (id) => {
    const filterData =
      orderData &&
      orderData.filter((data) => data.order?.transaction_id === id);
    setProductDetails(filterData);
    setName(filterData.map((data) => data.name));
    setMobile(filterData.map((data) => data.phone_number));
    setAddress(filterData.map((data) => data.address));
  };

  const handleVisibleProduct = () => {
    setProductDetails([]);
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return `${formattedDate}`;
  };

  const total = (total, fee) => {
    return parseInt(total) + parseInt(fee);
  };
  const handleStatusChange = (id, value) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [id]: value,
    }));
  };

  const UpdateStatus = async (id) => {
    if (!status[id]) {
      toast.warning("Please Select Status");
      return;
    }

    const status_id = status[id];
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/put/status/change/`,
        {
          method: "PUT",
          body: JSON.stringify({ status_id, id }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        const updatedData = orderData.map((item) =>
          item.id === data.id ? data : item
        );
        setOrderData(updatedData);
        setStatus({});
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error updating status");
    }
  };
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/search/transaction/`,
        {
          method: "POST",
          body: JSON.stringify({ transaction_id: searchTransactioId }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        setOrderData(data);
      } else {
        setOrderData([]);
        toast.warning("Not Found Any Data");
      }
    
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error updating status");
    }
  };
  const handleDeleteOrder = async (id) => {
    const confirmation = window.confirm("Are you sure delete this product");
    if (confirmation) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/order/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Order Deleted Sucessfully");
          fetchProduct();
        }
        // setMaterilaData(data.material);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  return (
    <>
      <Sidebar pageName = "Manage Order"/>
      <ToastContainer autoClose={1000} />
      <div className="container p-2 ">
        {ProductDetails.length > 0 ? (
          <div className="card  p-2">
            <div className="d-flex gap-3 align-items-right">
              <div className="col-md-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={handleVisibleProduct}
                >
                  Back
                </button>
              </div>
              <div className=" col-md-7 text-center">
                <h3>Order Datails</h3>
              </div>
            </div>
            <div className="card-header ">
              <div className="row">
                <div className="col-md-4">Customer Name: {name}</div>
                <div className="col-md-5 text-left">
                  Delivery Address: {address}
                </div>
                <div className="col-md-3 text-center">
                  <a href={`tel:+88${mobile_number}`}>
                    Mobile Number: +88{mobile_number}
                  </a>
                </div>
              </div>
            </div>
            <div className="table-responsive mt-2">
              {ProductDetails.map((data) => (
                <>
                  <table className="table  table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Serial No</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Material</th>
                        <th>Image</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.order_items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          <td className="product_name_table">
                            {item.variant?.product?.name}
                          </td>

                          <td>
                            {item.variant?.product?.brand?.name || "None"}
                          </td>
                          <td>
                            {item.variant?.product?.material?.name || "None"}
                          </td>
                          <td>
                            <img
                              src={`${process.env.REACT_APP_ClOUD}${item.variant?.image?.image}`}
                              alt="Product"
                              className="product-image"
                            />
                          </td>
                          <td>{item.variant?.image?.color?.name}</td>
                          <td>{item.variant?.size?.name}</td>
                          <td>{item.quantity}</td>
                          <td style={{ textAlign: "right" }}>
                            {item.get_total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={8}>Total</td>
                        <td className="text-right">
                          {data.order.get_cart_total}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={8}>Delivery Fee</td>
                        <td className="text-right">{data.delivery_fee?.fee}</td>
                      </tr>
                      <tr>
                        <td colSpan={8}>Net Total</td>
                        <td className="text-right">
                          {total(
                            data.order.get_cart_total,
                            data.delivery_fee?.fee
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              ))}
            </div>
          </div>
        ) : (
          <div className="card  p-2">
            <div className="mb-3 d-flex gap-3">
              <div className=" d-flex gap-3 col-md-3">
                <input
                  type="text"
                  placeholder="transaction no"
                  className="form-control"
                  onChange={(e) => setSearchTransactionId(e.target.value)}
                  value={searchTransactioId}
                  list="transactionList"
                />

                <datalist id="transactionList">
                  {orderData.map((data, index) => (
                    <option key={index} value={data.order?.transaction_id}>
                      {data.order?.transaction_id}
                    </option>
                  ))}
                </datalist>

                <button className="btn btn-success" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <button className="btn btn-secondary" onClick={fetchProduct}>
                Show All
              </button>
            </div>
            <div className="table-responsive table_height">
              <table className="table  table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Transaction No</th>
                    <th>Customer Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Create At</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((data, index) => (
                    <tr key={index}>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {index + 1}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {data.order?.transaction_id}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                        className="product_name_table"
                      >
                        {data.name}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {data.address || "none"}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {data.phone_number || "none"}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {formatDate(data.date_added)}
                      </td>
                      <td
                        onClick={() =>
                          handleShowDeatils(data.order?.transaction_id)
                        }
                      >
                        {data.status.status_name}
                      </td>
                      <td className="product_details_table">
                        <select
                          className="form-select"
                          onChange={(e) =>
                            handleStatusChange(data.id, e.target.value)
                          }
                          value={status[data.id] || "Select Status"}
                        >
                          <option>Select Status</option>
                          {statusData &&
                            statusData.map((data, index) => (
                              <option value={data.id} key={index}>
                                {data.status_name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="action-buttons">
                        <button
                          title="Update Status"
                          onClick={() => UpdateStatus(data.id)}
                        >
                          <RxUpdate size={20} />
                        </button>
                        <button
                          className="edit_button"
                          onClick={() => handleDeleteOrder(data.id)}
                        >
                          <MdDelete size={20} color="red" />
                        </button>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end">
                <li className="page-item disabled">
                  <Link className="page-link">Previous</Link>
                </li>
                <li className="page-item">
                  <Link className="page-link">1</Link>
                </li>
                <li className="page-item " aria-current="page">
                  <Link className="page-link">2</Link>
                </li>
                <li className="page-item">
                  <Link className="page-link">3</Link>
                </li>
                <li className="page-item">
                  <Link className="page-link">Next</Link>
                </li>
              </ul>
            </nav> */}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageOrder;
