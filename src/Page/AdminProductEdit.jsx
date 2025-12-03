import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const api = import.meta.env.VITE_API_URL || "http://localhost:8888";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryEnum: "",
    skinTypeEnum: [],
    concernTypeEnum: [],
    brand_id: "",
    ingredients: "",
  });

  const [brands, setBrands] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const skinOptions = ["OILY", "DRY", "NORMAL", "SENSITIVE"];
  const concernOptions = ["ACNE", "AGING", "DARK_SPOTS", "PORES"];
  const categoryOptions = [
    "CLEANSER",
    "MOISTURIZER",
    "TONER",
    "SERUM",
    "SUNSCREEN",
    "MASK",
    "EYE_CREAM",
    "SPOT_TREATMENT",
    "OIL",
  ];

  // Load brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${api}/api/brand/all`);
        setBrands(res.data.result || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBrands();
  }, [api]);

  // Load product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${api}/api/product/${productId}`);
        const data = res.data.result || res.data;
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          imageUrl: data.imageUrl || "",
          categoryEnum: data.categoryEnum || "",
          skinTypeEnum: data.skinTypeEnum || [],
          concernTypeEnum: data.concernTypeEnum || [],
          brand_id: data.brand_id || "",
          ingredients: data.ingredients || "",
        });
        setPreviewUrl(data.imageUrl || "");
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu sản phẩm");
        navigate("/admin/product");
      }
    };
    fetchProduct();
  }, [api, productId, navigate]);

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  const toggleArray = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((x) => x !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${api}/api/upload/product`, { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok && data.result?.url) return data.result.url;
    throw new Error("Upload thất bại");
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) return alert("Tên sản phẩm không được để trống!");
    if (!form.brand_id) return alert("Vui lòng chọn thương hiệu!");
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      await axios.put(`${api}/api/product/${productId}`, { ...form, imageUrl });
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/product");
    } catch (err) {
      console.error(err);
      alert("Cập nhật sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Quay về
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-md space-y-4">
        <input
          className="border w-full p-2 rounded"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <textarea
          className="border w-full p-2 rounded"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <input
          type="number"
          className="border w-full p-2 rounded"
          placeholder="Giá"
          value={form.price}
          onChange={(e) => updateField("price", Number(e.target.value))}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="Thành phần (ingredients)"
          value={form.ingredients}
          onChange={(e) => updateField("ingredients", e.target.value)}
        />

        {/* Upload ảnh */}
        <div>
          <label className="font-semibold">Ảnh sản phẩm:</label>
          <div className="mt-2 flex items-center gap-4">
            {previewUrl && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImageFile(null); setPreviewUrl(""); }}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-3 py-1 rounded-md bg-[#FF9090] text-white hover:bg-[#ff7b7b]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleSelectImage}
              hidden
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold">Category:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateField("categoryEnum", c)}
                className={`px-3 py-1 rounded-full border ${
                  form.categoryEnum === c ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Types */}
        <div>
          <label className="font-semibold">Skin Type:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skinOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("skinTypeEnum", s)}
                className={`px-3 py-1 rounded-full border ${
                  form.skinTypeEnum.includes(s)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Concern Types */}
        <div>
          <label className="font-semibold">Concern Type:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {concernOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleArray("concernTypeEnum", c)}
                className={`px-3 py-1 rounded-full border ${
                  form.concernTypeEnum.includes(c)
                    ? "bg-red-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="font-semibold">Brand:</label>
          <select
            value={form.brand_id}
            onChange={(e) => updateField("brand_id", e.target.value)}
            className="border w-full p-2 rounded mt-2"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
        </button>
      </div>
    </div>
  );
}
