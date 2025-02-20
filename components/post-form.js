"use client";

import { useState } from "react";
import FormSubmit from "@/components/form-submit";

export default function PostForm({ action }) {
  const [errors, setErrors] = useState([]);
  const [requirements, setRequirements] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [technologies, setTechnologies] = useState([""]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // ✅ add dynamic arrays do FormData
    formData.append("requirements", JSON.stringify(requirements));
    formData.append("skills", JSON.stringify(skills));
    formData.append("benefits", JSON.stringify(benefits));
    formData.append("technologies", JSON.stringify(technologies));
    formData.append("languages", JSON.stringify(selectedLanguages));

    const result = await action(formData);

    if (result && result.errors) {
      setErrors(result.errors); 
    }
  };
  const addRequirement = () => setRequirements([...requirements, ""]);
  const updateRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };
  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addTechnology = () => setTechnologies([...technologies, ""]);
  const updateTechnology = (index, value) => {
    const updated = [...technologies];
    updated[index] = value;
    setTechnologies(updated);
  };
  const removeTechnology = (index) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

 
  const addSkill = () => setSkills([...skills, ""]);
  const updateSkill = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const updateBenefit = (index, value) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };
  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLanguages((prevLanguages) =>
      checked
        ? [...prevLanguages, value]
        : prevLanguages.filter((lang) => lang !== value)
    );
  };

  return (
    <>
      <h1>Create a new position</h1>
      <form className="form-layout" onSubmit={handleSubmit}>
        <p className="form-control">
          <label htmlFor="title">Position name</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="company">Company name</label>
          <input type="text" id="company" name="company" />
        </p>
        <p className="form-control">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </p>
        <p className="form-control">
          <label htmlFor="salary">Salary</label>
          <input type="text" id="salary" name="salary" />
        </p>
        <div className="custom-dropdown">
          <label htmlFor="jobContract" className="form-control label">
            Job contract
          </label>
          <select id="jobContract" name="jobContract">
            <option value="">Select job contract</option>
            <option value="Full time">Full time</option>
            <option value="Part time">Part time</option>
            <option value="Freelance">Freelance</option>
            <option value="IČO">IČO</option>
            <option value="Contractor">Contractor</option>
            <option value="Trainee">Trainee</option>
          </select>
        </div>

        <p className="custom-dropdown">
          <label htmlFor="field">Field</label>
          <select id="field" name="field">
            <option value="">Select field</option>
            <option value="Web development">Web development</option>
            <option value="QA / Tester">QA / Tester</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="IT Analyst">IT Analyst</option>
            <option value="Project manager">Project manager</option>
            <option value="IT admin">IT admin</option>
          </select>
        </p>

        <p className="custom-dropdown">
          <label htmlFor="seniority">Seniority</label>
          <select id="seniority" name="seniority">
            <option value="">Select field</option>
            <option value="Junior">Junior</option>
            <option value="Medior">Medior</option>
            <option value="Senior">Senior</option>
            <option value="Student">Student</option>
          </select>
        </p>
        <p className="form-control">
          <label htmlFor="image">Image </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <div>
          <label className="language-title">Languages</label>
          <div className="language-container">
            {["English", "German", "French", "Spanish", "Czech", "Slovak"].map(
              (lang) => (
                <label key={lang} className="language-option">
                  <input
                    type="checkbox"
                    value={lang}
                    checked={selectedLanguages.includes(lang)}
                    onChange={handleLanguageChange}
                    className="checkbox"
                  />
                  {lang}
                </label>
              )
            )}
          </div>
        </div>

        <div className="dynamic-section">
          <label className="input-title">Technology</label>
          {technologies.map((tech, index) => (
            <div key={index} className="dynamic-input">
              <input
                type="text"
                name="technologies[]"
                value={tech}
                onChange={(e) => updateTechnology(index, e.target.value)}
                placeholder="Enter technology"
                required
              />
              {technologies.length > 1 && (
                <button type="button" onClick={() => removeTechnology(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTechnology} className="add-btn">
            + Add technology
          </button>
        </div>

        <p className="form-control">
          <label htmlFor="content">About position</label>
          <textarea id="content" name="content" rows="5" />
        </p>
        <div className="dynamic-section">
          <label className="input-title">Náplň práce</label>
          {requirements.map((req, index) => (
            <div key={index} className="dynamic-input">
              <input
                type="text"
                name="requirements[]"
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="Enter requirement"
                required
              />
              {requirements.length > 1 && (
                <button type="button" onClick={() => removeRequirement(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addRequirement} className="add-btn">
            + Add náplň práce
          </button>
        </div>

        <div className="dynamic-section">
          <label className="input-title">Skills / Qualifications</label>
          {skills.map((skill, index) => (
            <div key={index} className="dynamic-input">
              <input
                type="text"
                value={skill}
                name="skills[]"
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="Enter skill/qualification"
                required
              />
              {skills.length > 1 && (
                <button type="button" onClick={() => removeSkill(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSkill} className="add-btn">
            + Add Skill
          </button>
        </div>

        <div className="dynamic-section">
          <label className="input-title">Benefits</label>
          {benefits.map((benefit, index) => (
            <div key={index} className="dynamic-input">
              <input
                type="text"
                value={benefit}
                name="benefits[]"
                onChange={(e) => updateBenefit(index, e.target.value)}
                placeholder="Enter benefit"
                required
              />
              {benefits.length > 1 && (
                <button type="button" onClick={() => removeBenefit(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addBenefit} className="add-btn">
            + Add Benefit
          </button>
        </div>
        <div className="form-actions">
          <FormSubmit />
        </div>
        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
