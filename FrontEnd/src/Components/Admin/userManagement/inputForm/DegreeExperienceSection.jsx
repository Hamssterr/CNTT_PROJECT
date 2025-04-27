import React from 'react'

const DegreeExperienceSection = ({ degree, experience, setFormData }) => {
    const handleChange = (section, index, name, value) => {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    };
  
    const addItem = (section) => {
      const emptyItem =
        section === "degree"
          ? { name: "", institution: "", year: "", major: "" }
          : { position: "", company: "", startDate: "", endDate: "", description: "" };
  
      setFormData((prev) => ({
        ...prev,
        [section]: [...prev[section], emptyItem],
      }));
    };
  
    return (
      <>
        <div>
          <h4 className="font-semibold text-sm mb-2">Degrees</h4>
          {degree.map((deg, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              {["name", "institution", "year", "major"].map((field) => (
                <InputField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={deg[field]}
                  onChange={(e) => handleChange("degree", i, field, e.target.value)}
                />
              ))}
            </div>
          ))}
          <button type="button" onClick={() => addItem("degree")} className="text-blue-600 text-sm hover:underline">
            + Add Degree
          </button>
        </div>
  
        <div>
          <h4 className="font-semibold text-sm mb-2 mt-4">Experience</h4>
          {experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              {["position", "company", "startDate", "endDate", "description"].map((field) => (
                <InputField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={exp[field]}
                  onChange={(e) => handleChange("experience", i, field, e.target.value)}
                />
              ))}
            </div>
          ))}
          <button type="button" onClick={() => addItem("experience")} className="text-blue-600 text-sm hover:underline">
            + Add Experience
          </button>
        </div>
      </>
    );
  };
  
  export default DegreeExperienceSection;
  
