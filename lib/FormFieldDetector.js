import React, { useState } from "react";

export default function FormFieldDetector({ fieldLabels = [], onSubmit }) {
  const [fields, setFields] = useState(
    fieldLabels.map((label) => ({ label, value: "" }))
  );

  const handleChange = (index, value) => {
    const updated = [...fields];
    updated[index].value = value;
    setFields(updated);
  };

  const handleSubmit = () => {
    const formData = {};
    fields.forEach((field) => {
      formData[field.label] = field.value;
    });
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div>
      {fields.map((field, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <label>
            {field.label}
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleChange(i, e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>
        </div>
      ))}
      <button onClick={handleSubmit} style={{ padding: "8px 12px" }}>
        Submit Form
      </button>
    </div>
  );
}
