import React from "react";
type Props = {
  onClick: () => void;
  value: string;
  isActive: boolean;
};

function FilterButton({ isActive, onClick, value }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 15px",
        border: "1px solid #ccc",
        borderRadius: "15px",
        backgroundColor: isActive ? "rgb(193, 127, 204)" : "#fff",
        color: isActive ? "#fff" : "#000",
        cursor: "pointer",
      }}
    >
      {value}
    </button>
  );
}

export default FilterButton;
