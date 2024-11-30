import Sidebar from "../../components/Sidebar";
import "./add_product.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
function EditProduct() {
  const [rows, setRows] = useState([
    { image: "", color: "", id: "", image_id: "" },
  ]);
  const [variationsVisible, setVariationsVisible] = useState(false);
  const [sizeVisible, setSizeVisible] = useState(false);
  const [loading, setLoaidng] = useState(false);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [material, setMaterial] = useState([]);
  const [color, setColor] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [filterCategory, setFilterCatgeory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([{ size: "" }]);
  const [variations, setVariations] = useState([]);
  const [variant, setVariant] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    subcategory: "",
    product_name: "",
    brand: "",
    material: "",
    discount: "",
    cover_image: "",
    description: "",
  });
  // api/get-brand/
  useEffect(() => {
    fetchBrand();
  }, []);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}/admin-panel/api/get-product/${id}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const { product, variant } = await response.json();

        console.log("variant", variant);
        setVariant(variant);

        setProduct({
          subcategory: product.Product_SubCategory?.id || "",
          product_name: product.name || "",
          brand: product.brand?.id || "",
          material: product.material?.id || "",
          discount: product.discount || "",
          cover_image: product.cover_image || "",
          description: product.details || "",
        });
        setSelectCategory(product.Product_SubCategory?.category?.category_name);

        const uniqueColors = new Map();

        // Map through the variant array and filter by unique color name
        const mappedRows = variant
          .filter((item) => {
            if (!uniqueColors.has(item.image.color.name)) {
              uniqueColors.set(item.image.color.name, true);
              return true;
            }
            return false;
          })
          .map((item) => ({
            image_id: item.image.id,
            image: item.image.image, // set image URL
            color: item.image.color.name, // set color name
          }));

        // Set rows state with only unique colors
        setRows(mappedRows);

        // Set image previews for unique colors
        mappedRows.forEach((item, index) => {
          setImagePreviews((prev) => ({
            ...prev,
            [index]: `${process.env.REACT_APP_ClOUD}${item.image}`,
          }));
        });
        const mappedSize = [];
        const uniqueSizes = new Set();

        variant.forEach((item) => {
          const sizeName = item.size.name;

          // Check if the size is already added
          if (!uniqueSizes.has(sizeName)) {
            uniqueSizes.add(sizeName);
            mappedSize.push({
              id: item.id,
              size: sizeName,
              quantity: item.quantity,
            });
          }
        });

        setSelectedSizes(mappedSize);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBrand();
  }, [id]);

  useEffect(() => {
    const generateColorVariations = () => {
      // Initialize a map to store variations by color
      const colorMap = new Map();
      setSizeVisible(true);
      setVariationsVisible(true);
      // Loop through each item from the database
      variant.forEach((item) => {
        const colorName = item.image.color.name; // Assuming 'color.name' holds the color name

        // If the color is already in the map, add the size and quantity to its size array
        if (colorMap.has(colorName)) {
          const existingEntry = colorMap.get(colorName);
          existingEntry.size.push({
            id: item.id,
            size: item.size.name,
            quantity: item.quantity,
            price: item.price,
          });
        } else {
          // If color is not in map, create a new entry
          colorMap.set(colorName, {
            color: colorName,
            image: item.image.image, // Assuming 'image.image' holds the image URL
            size: [
              {
                id: item.id,
                size: item.size.name,
                quantity: item.quantity,
                price: item.price,
              },
            ],
          });
        }
      });

      // Convert the map to an array
      const uniqueColorVariations = Array.from(colorMap.values());

      // Set the state with the new variations array
      setVariations(uniqueColorVariations);
    };
    if (rows) {
      generateColorVariations();
    }
  }, [rows, variant]);

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
      setSubCategory(data.subcategory);
      setBrand(data.brand);
      setCategory(data.category);
      setMaterial(data.material);
      setSizeData(data.size);
      setColor(data.color);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const addRow = () => {
    setRows([...rows, { image: "", color: "" }]);
  };

  const handleImageChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].image = event.target.files[0];
    setRows(newRows);
  };

  const handleColorChange = (index, event) => {
    const newRows = [...rows];
    newRows[index].color = event.target.value;
    setRows(newRows);
  };

  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  const removeRow = (idToRemove) => {
    if (rows.length === 1) {
      return;
    }
    setRows(rows.filter((_, index) => index !== idToRemove));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[idToRemove];
      return newPreviews;
    });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...selectedSizes];
    newSizes[index][field] = value; // Update the specified field of the selected size object
    setSelectedSizes(newSizes);
  };

  const addSize = () => {
    setSelectedSizes([...selectedSizes, { size: "" }]); // Add a new empty size object
  };

  // const [variations, setVariations] = useState([{ image: "", color: "",size:"",quantity:""}]);

  const generateVariations = () => {
    const isValid = selectedSizes.every((size) => size.size);
    console.log(selectedSizes);

    if (isValid) {
      setVariationsVisible(true);
      let newVariations = [];
      let processedCombinations = new Set();

      rows.forEach((row) => {
        selectedSizes.forEach((size) => {
          if (size.size) {
            const combinationKey = `${row.image}-${row.color}`;

            if (!processedCombinations.has(combinationKey)) {
              // Add the combination to the set
              processedCombinations.add(combinationKey);

              // Add size variations for this image-color combination
              newVariations.push({
                id: row.id,
                image: row.image,
                color: row.color,
                size: selectedSizes.map((s) => ({
                  size: s.size,
                  quantity: "",
                })),
              });
            }
          }
        });
      });

      setVariations(newVariations);
    } else {
      toast.warning("Please Add Size");
    }
  };

  const handleVariationChange = (rowIndex, sizeIndex, field, value) => {
    const updatedVariations = [...variations];
    const sizeToUpdate = updatedVariations[rowIndex].size[sizeIndex];
    sizeToUpdate[field] = value;
    setVariations(updatedVariations);
  };
  const handleVisibleSize = () => {
    const isValid = rows.every((row) => row.image && row.color);
    if (isValid) {
      setSizeVisible(true);
    } else {
      toast.warning("Please Add Image And Color");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  // const handleImage = (e) => {
  //   const file = e.target.files[0]; // Get the selected file
  //   if (file) {
  //     setImageFile(file);
  //     // Optional: Display image preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setcoverImage(reader.result);
  //     };
  //     reader.readAsDataURL(file); // Convert the file to a data URL
  //   }
  // };
  const handleQuillChange = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: value,
    }));
  };
  useEffect(() => {
    const filter = subcategory.filter(
      (data) => data.category.category_name === selectCategory
    );
    setFilterCatgeory(filter);
  }, [selectCategory]);

  const saveProduct = async (product) => {
    setLoaidng(true);
    const formData = new FormData();

    formData.append("subcategory", product.subcategory);
    formData.append("product_name", product.product_name);
    formData.append("brand", product.brand);
    formData.append("material", product.material);
    formData.append("discount", product.discount);
    formData.append("description", product.description);

    // Create an array of variations with image keys (without actual file objects)
    const variationsWithoutImages = product.variation.map(
      (variation, index) => {
        return {
          id: variation.id,
          color: variation.color,
          size: variation.size,
          price: variation.price,
          image: `image_${index}`, // Image key to refer in formData
        };
      }
    );

    // Append the variations as a JSON string (without image files)
    formData.append("variations", JSON.stringify(variationsWithoutImages));

    // Append each variation's image file separately
    product.variation.forEach((variation, index) => {
      if (variation.image instanceof File) {
        console.log(" variation.image", variation.image);
        // Check if the image is a File object
        formData.append(`image_${index}`, variation.image);
      } else {
        console.warn(
          `Variation ${index} does not contain a valid file:`,
          variation.image
        );
      }
    });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}/admin-panel/api/upadate/product/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Product Updated successfully");
      navigate(-1);
      setLoaidng(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleSaveProduct = async () => {
    const productData = {
      subcategory: product.subcategory,
      product_name: product.product_name,
      brand: product.brand,
      material: product.material,
      discount: product.discount,
      // cover_image: imgeFile, // Ensure this is a File object
      description: product.description,
      variation: variations.map((variation) => ({
        id: variation.id,
        price: variation.price,
        color: variation.color,
        size: variation.size,
        image: variation.image, // Ensure this is a File object
      })),
    };

    const savedProduct = await saveProduct(productData);
    if (savedProduct) {
      console.log("Product Updated successfully:", savedProduct);
    }
  };

  const handleImageFileChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <div className="container p-4">
        <div className="row">
          <div className="col-md-7">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Category*
              </label>
              <select
                type="text"
                value={selectCategory}
                onChange={(e) => setSelectCategory(e.target.value)}
                className="form-control"
              >
                <option value="">Select Category</option>
                {category.map((data) => (
                  <option>{data.category_name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Sub-Category
              </label>
              <select
                type="text"
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
                className="form-control"
              >
                <option>Select Sub-Category</option>
                {filterCategory.map((data) => (
                  <option value={data.id}>{data.subcategory_name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                name="product_name"
                value={product.product_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Brand
              </label>
              <select
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="form-control"
              >
                <option>Select Brand</option>
                {brand.map((data) => (
                  <option value={data.id}>{data.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Material
              </label>
              <select
                type="text"
                name="material"
                value={product.material}
                onChange={handleChange}
                className="form-control"
              >
                <option>Select Material</option>
                {material.map((data) => (
                  <option value={data.id}>{data.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                discount
              </label>
              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            {/* <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Cover Image
              </label>
              <div className="d-flex gap-3 ">
                <input
                  type="file"
                  name="cover_image"
                  value={product.cover_image}
                  onChange={(e) => {
                    handleChange(e);
                    handleImage(e);
                  }}
                  className="form-control coverimage"
                />
                {cover_image && (
                  <img
                    src={cover_image}
                    alt="Cover Preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </div>
            </div> */}
          </div>
          <div className="col-md-5">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Description
              </label>
              <div>
                <ReactQuill
                  ref={quillRef}
                  modules={modules}
                  className="textEditor"
                  value={product.description}
                  onChange={handleQuillChange}
                />
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="row mt-2">
          <div className="col-md-12">
            <div className="mb-3">Add Image and Color</div>
            {rows.map((row, index) => (
              <div key={index} className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor={`image-${index}`} className="form-label">
                      Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id={`image-${index}`}
                      // onChange={(e) => {
                      //   handleImageFileChange(index, e.target.files[0]);
                      //   handleImageChange(index, e); // If this function also needs to handle image change
                      // }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor={`color-${index}`} className="form-label">
                      Color
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`color-${index}`}
                      value={row.color}
                      // onChange={(e) => handleColorChange(index, e)}
                      list="product_code_list"
                    />
                    <datalist id="product_code_list">
                      {color.length > 0 &&
                        color.map((product, colorIndex) => (
                          <option key={colorIndex}>{product.name}</option>
                        ))}
                    </datalist>
                  </div>
                </div>
                {/* <div className="col-md-2">
                  <div className="image_add_button d-flex gap-3">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div> */}
                <div className="col-md-2">
                  <div className="image_add_button d-flex gap-3">
                    {imagePreviews[index] ? (
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index}`}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="col-md-3 d-flex gap-3 mb-3">
            <button type="button" onClick={addRow} className="btn btn-dark">
              Add Another Image
            </button>
            <button
              type="button"
              onClick={handleVisibleSize}
              className="btn btn-success"
            >
              Apply
            </button>
          </div> */}
          {sizeVisible && (
            <>
              <hr />
              <h5>Add Size</h5>
              <div className="col-md-12">
                <div className=" row ">
                  {selectedSizes.map((size, index) => (
                    <div className="col-md-2">
                      <select
                        key={index}
                        value={size.size}
                        // onChange={(e) =>
                        //   handleSizeChange(index, "size", e.target.value)
                        // }
                        className=" select2 form-select mb-3"
                        // multiple="multiple"
                      >
                        <option value="">Select Size</option>
                        {sizeData.map((data) => (
                          <option>{data.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                {/* <div className="col-md-3 d-flex gap-3 mb-3">
                  <button
                    type="button"
                    onClick={addSize}
                    className="btn btn-dark"
                  >
                    Add Another Size
                  </button>
                  <button
                    type="button"
                    onClick={() => generateVariations()}
                    className=" btn  btn-success"
                  >
                    Apply
                  </button>
                </div> */}
              </div>
            </>
          )}
        </div>
        {variationsVisible && (
          <>
            <hr />
            <div>
              <h4>Add Product Variation</h4>
            </div>

            <div className="row">
              <div className="col-md-10 table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    {variations.map((data, rowIndex) => (
                      <tr>
                        <td className="col-md-3 position-relative">
                          <div className="color_column">{data.color}</div>
                        </td>
                        <td>
                          {data.size.map((d, sizeIndex) => (
                            <table className="table table-bordered">
                              <tr key={sizeIndex}>
                                <td className="col-md-2 position-relative">
                                  <div className="color_column">{d.size}</div>
                                </td>
                                <td className="col-md-2 col-sm-2">
                                  <input
                                    style={{ background: "white" }}
                                    type="text"
                                    className="form-control"
                                    placeholder="quantity"
                                    value={d.quantity}
                                    onChange={(e) =>
                                      handleVariationChange(
                                        rowIndex,
                                        sizeIndex,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="col-md-2 col-sm-2">
                                  <input
                                    style={{ background: "white" }}
                                    type="number"
                                    className="form-control"
                                    placeholder="price"
                                    value={d.price }
                                    onChange={(e) =>
                                      handleVariationChange(
                                        rowIndex,
                                        sizeIndex,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            </table>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="div">
                  <button
                    className="btn btn-success d-flex align-items-center  justify-content-center"
                    onClick={handleSaveProduct}
                  >
                    {loading ? (
                      <span className="loader_loading"></span>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default EditProduct;
