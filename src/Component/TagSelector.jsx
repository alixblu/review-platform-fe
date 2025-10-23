import { useState } from "react";

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tên sản phẩm..."
          className="flex-1 border rounded-md p-2 focus:outline-none"
        />
        <button
          onClick={addTag}
          className="bg-[#FF9090] text-white px-3 py-1 rounded-md"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {selectedTags.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 border px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
