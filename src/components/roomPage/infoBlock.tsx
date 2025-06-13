import React from "react";

interface infoBlockProps {
  name: string;
  onDelete: () => void;
}

const infoBlock: React.FC<infoBlockProps> = ({ name, onDelete }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        background: "#fff",
        padding: "10px 15px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 10,
      }}
    >
      <div>
        <strong>Choose:</strong> {name}
      </div>
      <button
        onClick={onDelete}
        style={{
          marginTop: "10px",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default infoBlock;
