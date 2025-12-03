import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function AdminProductCreate() {
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
  const [media, setMedia] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
  }, []);

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

  const handleSelectMedia = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (url) => {
    setMedia((prev) => prev.filter((m) => m.url !== url));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${api}/api/upload/product`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.result?.url) return data.result.url;
    throw new Error("Upload failed");
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return alert("Tên sản phẩm không được để trống!");
    if (!form.brand_id) return alert("Vui lòng chọn thương hiệu!");
    setLoading(true);

    try {
      // Upload ảnh nếu có
      let imageUrl = "";
      if (media.length > 0) {
        imageUrl = await uploadFile(media[0].file); // chỉ 1 ảnh chính
      }

      await axios.post(`${api}/api/product`, {
        ...form,
        imageUrl,
      });

      alert("Thêm sản phẩm thành công!");
      setForm({
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
      setMedia([]);
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>

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

        {/* Upload image */}
        <div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-3 py-1 bg-[#FF9090] text-white rounded-md"
          >
            Chọn ảnh
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleSelectMedia}
            hidden
          />
        </div>

        {media.length > 0 && (
          <div className="mt-2">
            <img
              src={media[0].url}
              alt="preview"
              className="w-32 h-32 object-cover border rounded"
            />
            <button
              onClick={() => handleRemoveMedia(media[0].url)}
              className="ml-2 p-1 bg-red-500 text-white rounded"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Category (1 giá trị) */}
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

        {/* Skin Type */}
        <div>
          <label className="font-semibold">Skin Type:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skinOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("skinTypeEnum", s)}
                className={`px-3 py-1 rounded-full border ${
                  form.skinTypeEnum.includes(s) ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Concern Type */}
        <div>
          <label className="font-semibold">Concern Type:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {concernOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleArray("concernTypeEnum", c)}
                className={`px-3 py-1 rounded-full border ${
                  form.concernTypeEnum.includes(c) ? "bg-red-500 text-white" : "bg-gray-100"
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
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang thêm..." : "Thêm sản phẩm"}
        </button>
      </div>
    </div>
  );
}
