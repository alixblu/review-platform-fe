import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./Layout/MainLayout";

// Pages
import HomePage from "./Page/HomePage";
import ProductDetail from "./Page/ProductDetail";
import AddProduct from "./Page/AddProduct";
import BrandManagement from "./Page/BrandManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/brands" element={<BrandManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
