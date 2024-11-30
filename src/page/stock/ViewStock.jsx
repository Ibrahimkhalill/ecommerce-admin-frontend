import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import "./stock.css";

const ViewStock = () => {
  const [stockData, setStockData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [product, setProduct] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [filterStockData, setFilterStcokdata] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/stockAll/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setStockData(data);
      setFilterStcokdata(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBrand = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/api/get-brand/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      setSizeData(data.size);
      setColorData(data.color);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchBrand();
  }, []);

  useEffect(() => {
    const filter = filterStockData.filter((item) => {
      // Apply conditions only if each filter value is provided
      return (
        (!product ||
          item.variation?.product?.name
            .toLocaleLowerCase()
            .includes(product.toLocaleLowerCase())) &&
        (!color || item.variation?.image?.color?.name === color) &&
        (!size || item.variation?.size?.name === size)
      );
    });

    setStockData(filter);
  }, [color, product, size, filterStockData]);
  const handleDeleteProduct = async (id) => {
    const confirmation = window.confirm("Are you sure delete this product");
    if (confirmation) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/stock/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Stock Deleted Sucessfully");
          fetchProduct();
        }
        // setMaterilaData(data.material);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };
  return (
    <div>
      <Sidebar />
      <div className="px-3">
        <div className="d-flex gap-3 align-items-center mt-2">
          <div className=" col-md-12 text-center">
            <h3>View Stock</h3>
          </div>
        </div>
        <div className="card col-md-12 py-3 my-2 px-2  search_stock">
          <div className="search_input col-lg-5  d-flex  align-items-center justify-content-center ">
            <input
              type="text"
              className=" form-control"
              placeholder="Search product"
              list="stock-options"
              onChange={(e) => setProduct(e.target.value)}
              // onChange={handleSearch}
            />
            <button className="search_button">
              <IoSearchOutline size={20} color="white" />
            </button>
            <datalist id="stock-options">
              {[
                ...new Set(
                  filterStockData.map((item) => item.variation?.product?.name)
                ),
              ].map((uniqueName, index) => (
                <option key={index} value={uniqueName}>
                  {uniqueName}
                </option>
              ))}
            </datalist>
          </div>
          <div className="search_input col-md-3 d-flex  align-items-center justify-content-center ">
            <select
              type="text"
              className=" form-control"
              placeholder="search product"
              onChange={(e) => setSize(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Size</option>
              {sizeData.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="search_input col-md-3 d-flex  align-items-center justify-content-center ">
            <select
              type="text"
              className=" form-control"
              placeholder="search product"
              onChange={(e) => setColor(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Color</option>

              {colorData.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card  p-2">
          <div className="table-responsive table_stock mt-2">
            <table className="table  table-bordered table-hover">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Product</th>
                  <th>Color</th>
                  <th>Image</th>
                  <th>Size</th>
                  <th>Initial Quantity</th>
                  <th>Sold Quantity</th>
                  <th>Quantity</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 &&
                  stockData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="product_name_stock">
                        {data.variation?.product?.name}
                      </td>
                      <td>{data.variation?.image?.color?.name}</td>

                      <td>
                        <img
                          src={`${process.env.REACT_APP_ClOUD}${data.variation?.image?.image}`}
                          alt="Product"
                          className="product-image"
                        />
                      </td>
                      <td>{data.variation?.size?.name}</td>
                      <td>{data.initial_quantity}</td>
                      <td>{data.sold_quantity}</td>
                      <td>{data.quantity}</td>
                      {/* <td className="action-buttons">
                        <button title="Edit">
                          <FaEdit size={20} />
                        </button>
                        <button
                          title="delete"
                          onClick={() => handleDeleteProduct(data.id)}
                        >
                          <MdDelete size={20} color="red" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStock;
