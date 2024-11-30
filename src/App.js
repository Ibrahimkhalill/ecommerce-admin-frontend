import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./page/authentication/Auth";

import NotFoundPage from "./page/NotFoundPage";

import Home from "./page/Home/Home";
import LoginForm from "./page/authentication/Login";
import Signup from "./page/authentication/SignUp";
import AddProduct from "./page/product/AddProduct";
import ManageProduct from "./page/product/ManageProduct";
import ManageOrder from "./page/order/ManageOrder";
import AddCategory from "./page/category/AddCategory";
import AddSubCategory from "./page/category/AddSubCategory";
import AddBrand from "./page/brand/AddBrand";
import AddMaterial from "./page/material/AddMaterial";
import AddColor from "./page/color/AddColor";
import AddSize from "./page/size/AddSize";
import QuestionAnswer from "./page/q&a/QuestionAnswer";
import ViewStock from "./page/stock/ViewStock";
import EditProduct from "./page/product/EditProduct";
import DisplaySlider from "./page/display/DisplaySlider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<LoginForm />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/home"
            element={<ProtectedRoute component={<Home />} />}
          />
          <Route
            path="/view-stock"
            element={<ProtectedRoute component={<ViewStock />} />}
          />
          <Route
            path="/add-product"
            element={<ProtectedRoute component={<AddProduct />} />}
          />
          <Route
            path="/manage-product"
            element={<ProtectedRoute component={<ManageProduct />} />}
          />
          <Route
            path="/manage-order"
            element={<ProtectedRoute component={<ManageOrder />} />}
          />
          <Route
            path="/add-category"
            element={<ProtectedRoute component={<AddCategory />} />}
          />
          <Route
            path="/add-brand"
            element={<ProtectedRoute component={<AddBrand />} />}
          />
          <Route
            path="/add-material"
            element={<ProtectedRoute component={<AddMaterial />} />}
          />
          <Route
            path="/add-color"
            element={<ProtectedRoute component={<AddColor />} />}
          />
          <Route
            path="/add-size"
            element={<ProtectedRoute component={<AddSize />} />}
          />
          <Route
            path="/question-answer"
            element={<ProtectedRoute component={<QuestionAnswer />} />}
          />
          <Route
            path="/add-sub-category"
            element={<ProtectedRoute component={<AddSubCategory />} />}
          />
          <Route
            path="/product/edit-product/:id"
            element={<ProtectedRoute component={<EditProduct />} />}
          />
          <Route
            path="/display-slider"
            element={<ProtectedRoute component={<DisplaySlider />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ component }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? component : <Navigate to="/" replace />;
};

export default App;
