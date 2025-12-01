import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductSelector({ selectedProduct, setSelectedProduct }) {
const [products, setProducts] = useState([]);

useEffect(() => {
axios
.get("http://localhost:8888/api/product")
.then((res) => setProducts(res.data?.result || []))
.catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
}, []);

return ( <div className="max-h-64 overflow-y-auto">
{products.map((p) => (
<div
key={p.id}
className={`p-2 rounded-md cursor-pointer mb-1 border ${
            selectedProduct?.id === p.id ? "border-pink-500 bg-pink-50" : "border-gray-200"
          }`}
onClick={() => setSelectedProduct(p)}
>
<img
src={p.imageUrl ||"/example-product.jpg"}
alt={p.name}
className="w-12 h-12 object-cover inline-block mr-2 rounded"
/> <span>{p.name}</span> </div>
))} </div>
);
}
