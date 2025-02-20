"use client";

import { useState, useEffect, useMemo } from "react";

export default function Filter({ onApply }) {
  const [filters, setFilters] = useState({
    location: [],
    salary: 10000,
    jobContract: [],
    field: [],
    seniority: [],
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Salary is rendering on client
  }, []);

  const handleLocationClick = (location) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter((loc) => loc !== location)
        : [...prev.location, location],
    }));
  };

  const handleJobContractClick = (jobContract) => {
    setFilters((prev) => ({
      ...prev,
      jobContract: prev.jobContract.includes(jobContract)
        ? prev.jobContract.filter((job) => job !== jobContract)
        : [...prev.jobContract, jobContract],
    }));
  };

  const handleFieldClick = (field) => {
    setFilters((prev) => ({
      ...prev,
      field: prev.field.includes(field)
        ? prev.field.filter((fie) => fie !== field)
        : [...prev.field, field],
    }));
  };

  const handleSeniorityClick = (seniority) => {
    setFilters((prev) => ({
      ...prev,
      seniority: prev.seniority.includes(seniority)
        ? prev.seniority.filter((sen) => sen !== seniority)
        : [...prev.seniority, seniority],
    }));
  };

  const handleSalaryChange = (e) => {
    const newSalary = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      salary: newSalary,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filters applied:", filters);
    onApply(filters);
  };

  const formattedSalary = useMemo(
    () =>
      new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: "CZK",
      }).format(filters.salary),
    [filters.salary]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p>Locations:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            "Praha",
            "Brno",
            "Plzeň",
            "Ostrava",
            "Olomouc",
            "Kladno",
            "Mladá Boleslav",
          ].map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => handleLocationClick(location)}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "15px",
                backgroundColor: filters.location.includes(location)
                  ? "rgb(193, 127, 204)"
                  : "#fff",
                color: filters.location.includes(location) ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      <div className="salary-filter">
        <label>Salary range</label>
        <div className="salary-values">
          {isClient ? (
            <span>{formattedSalary} - 200 000 Kč</span>
          ) : (
            <span>{filters.salary} Kč - 200 000 Kč</span>
          )}
        </div>
        <input
          type="range"
          min="10000"
          max="200000"
          step="1000"
          value={filters.salary}
          onChange={handleSalaryChange}
          className="salary-slider"
        />
      </div>

      <div>
        <p>Job Contract:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            "Full time",
            "Part time",
            "Freelance",
            "IČO",
            "Contractor",
            "Trainee",
          ].map((jobContract) => (
            <button
              key={jobContract}
              type="button"
              onClick={() => handleJobContractClick(jobContract)}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "15px",
                backgroundColor: filters.jobContract.includes(jobContract)
                  ? "rgb(193, 127, 204)"
                  : "#fff",
                color: filters.jobContract.includes(jobContract)
                  ? "#fff"
                  : "#000",
                cursor: "pointer",
              }}
            >
              {jobContract}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p>Field:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            "Web development",
            "QA / Tester",
            "Marketing",
            "Design",
            "IT Analyst",
            "Project manager",
            "IT admin",
          ].map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => handleFieldClick(field)}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "15px",
                backgroundColor: filters.field.includes(field)
                  ? "rgb(193, 127, 204)"
                  : "#fff",
                color: filters.field.includes(field) ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p>Seniority:</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Junior", "Medior", "Senior", "Student"].map((seniority) => (
            <button
              key={seniority}
              type="button"
              onClick={() => handleSeniorityClick(seniority)}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "15px",
                backgroundColor: filters.seniority.includes(seniority)
                  ? "rgb(193, 127, 204)"
                  : "#fff",
                color: filters.seniority.includes(seniority) ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {seniority}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-filter" type="submit">
        Apply Filters
      </button>
    </form>
  );
}
