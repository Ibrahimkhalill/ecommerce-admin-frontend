import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./manage_product.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
function ManageProduct() {
  const [productData, setProductData] = useState([]);
  const [filterProductData, setFilterProductData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [ProductDetails, setProductDetails] = useState([]);
  // const [brandData, setBrandData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  // const [materialData, setMaterilaData] = useState([]);
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubcategory] = useState("");
  const [selectedId, setselectedId] = useState(null);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/productAll/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setProductData(data.products);
      setFilterProductData(data.products);
      setVariantData(data.variant);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAll = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/get/All/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      console.log("data", data.category);

      // setBrandData(data.brand);
      setCategoryData(data.category);
      // setMaterilaData(data.material);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
    fetchAll();
  }, []);
  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText || div.textContent || "";
  };

  const handleShowDeatils = (id) => {
    if (id === selectedId) {
      setselectedId(null);
    } else {
      const filter = variantData.filter((data) => data.product?.id == id);
      setProductDetails(filter);
      setselectedId(id);
    }
  };
  const handleVisibleProduct = () => {
    setProductDetails([]);
  };
  useEffect(() => {
    const filter = filterProductData.filter((item) => {
      // Apply conditions only if each filter value is provided
      return (
        (!product ||
          item.name
            .toLocaleLowerCase()
            .includes(product.toLocaleLowerCase())) &&
        (!category ||
          item.Product_SubCategory?.category?.category_name === category) &&
        (!subCategory ||
          item.Product_SubCategory?.subcategory_name === subCategory)
      );
    });

    setProductData(filter);
  }, [product, filterProductData, category, subCategory]);

  useEffect(() => {
    if (category) {
      const filter = categoryData.find(
        (item) => item.category_name === category
      );
      console.log("category", filter);

      setSubCategoryData(filter.subcategories);
    }
  }, [category, categoryData]);

  const handleEditPage = (id) => {
    navigate(`/product/edit-product/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    const confirmation = window.confirm("Are you sure delete this product");
    if (confirmation) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/product/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Product Deleted Sucessfully");
          fetchProduct();
        }
        // setMaterilaData(data.material);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleDeleteVaritions = async (id) => {
    const confirmation = window.confirm("Are you sure delete this row");
    if (confirmation) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/delete/variation/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Product Deleted Sucessfully");
          const filter = variantData.filter((data) => data.id != id);
          setProductDetails(filter);
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
      <Sidebar />
      <div className="container p-2 ">
        <h3 className="text-center">View Product</h3>
        <div className="mb-3 d-flex gap-2 flex-row flex-wrap card px-2 py-2 align-items-center justify-content-center">
          <div className="search_input col-lg-5  d-flex  align-items-center justify-content-center mx-2">
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
              {[...new Set(filterProductData.map((item) => item.name))].map(
                (uniqueName, index) => (
                  <option key={index} value={uniqueName}>
                    {uniqueName}
                  </option>
                )
              )}
            </datalist>
          </div>
          <div className=" d-flex gap-3 col-md-3 mx-2 search_input">
            <select
              type="text"
              className=" form-select"
              placeholder="search product"
              onChange={(e) => setCategory(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Category</option>
              {categoryData?.map((item) => (
                <option value={item.category_name}>{item.category_name}</option>
              ))}
            </select>
          </div>
          <div className=" d-flex gap-3 col-md-3 mx-2 search_input">
            <select
              type="text"
              className=" form-select"
              placeholder="search product"
              onChange={(e) => setSubcategory(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Sub Category</option>
              {subCategoryData?.map((item) => (
                <option value={item.subcategory_name}>
                  {item.subcategory_name}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="  d-flex gap-3 col-md-3 mx-2 search_input">
            <select
              type="text"
              className=" form-select"
              placeholder="search product"
              // onChange={(e) => setSize(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Brand</option>
              {brandData?.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className=" d-flex gap-3 col-md-3 mx-2 search_input">
            <select
              type="text"
              className=" form-select"
              placeholder="search product"
              // onChange={(e) => setSize(e.target.value)}
              // onChange={handleSearch}
            >
              <option value="">Select Material</option>
              {materialData?.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div> */}
        </div>
        {ProductDetails.length > 0 ? (
          <div className="card  p-2">
            <div className="d-flex gap-3 align-items-center">
              <div className="col-md-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={handleVisibleProduct}
                >
                  Back
                </button>
              </div>
              <div className=" col-md-7 text-center">
                <h3>Product Datails</h3>
              </div>
            </div>
            <div className="table-responsive mt-2">
              <table className="table  table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Color</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ProductDetails.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td className="product_name_table">
                        {data.image?.color?.name}
                      </td>

                      <td>
                        <img
                          src={`${process.env.REACT_APP_ClOUD}${data.image?.image}`}
                          alt="Product"
                          className="product-image"
                        />
                      </td>
                      <td>{data.size?.name}</td>
                      <td>{data.quantity}</td>

                      <td>{data.price}</td>
                      <td className="action-buttons">
                        <button onClick={() => handleDeleteVaritions(data.id)}>
                          <MdDelete size={30} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card  p-2">
            <div className="table-responsive table_height">
              <table className="table  table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Material</th>
                    <th>cover Image</th>
                    <th>Description</th>
                    <th>Descount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((data, index) => (
                    <tr
                      key={index}
                      className={`${
                        data.id === selectedId ? "table-active" : ""
                      } `}
                    >
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {index + 1}
                      </td>
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {data.Product_SubCategory?.category?.category_name}
                      </td>
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {data.Product_SubCategory.subcategory_name}
                      </td>
                      <td
                        onClick={() => handleShowDeatils(data.id)}
                        className="product_name_table"
                      >
                        {data.name}
                      </td>
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {data.brand?.name || "none"}
                      </td>
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {data.material?.name || "none"}
                      </td>

                      <td onClick={() => handleShowDeatils(data.id)}>
                        <img
                          src={`${process.env.REACT_APP_ClOUD}${data.cover_image}`}
                          alt="Product"
                          className="product-image"
                        />
                      </td>

                      <td
                        onClick={() => handleShowDeatils(data.id)}
                        className="product_details_table"
                      >
                        {stripHtmlTags(data.details)}
                      </td>
                      <td onClick={() => handleShowDeatils(data.id)}>
                        {data.discount || 0}
                      </td>

                      <td className="action-buttons">
                        <button onClick={() => handleEditPage(data.id)}>
                          <FaEdit size={25} title="Edit" />
                        </button>
                        <button onClick={() => handleDeleteProduct(data.id)}>
                          <MdDelete size={30} color="red" title="Delete" />
                        </button>
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

export default ManageProduct;
