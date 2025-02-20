"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { PiMoney } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import { TbArrowElbowRight } from "react-icons/tb";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;
    async function fetchPost() {
      console.log("Frontend - Fetching post for slug:", params.slug);

      const response = await fetch(`/api/posts/${params.slug}`);
      const data = await response.json();
      console.log("Frontend - Fetched Post Data:", data.post);

      setPost(data.post);
      setApplicants(data.applicants);
      setApplied(data.alreadyApplied);
    }
    fetchPost();
  }, [params?.slug]);

  const handleApply = () => {
    if (!user || !user.id) {
      alert("You must be logged in to apply.");
      return;
    }
    setShowModal(true);
  };

  const confirmApply = async () => {
    setShowModal(false);

    const response = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: user.id,
      },
      body: JSON.stringify({ postId: post.id }),
    });

    if (response.ok) {
      setApplied(true);
      setShowSuccessModal(true);
      router.refresh();
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Something went wrong. Please try again.");
    }
  };

  if (!post) return <p>Loading...</p>;

  function safeParse(jsonString) {
    try {
      return jsonString && typeof jsonString === "string"
        ? JSON.parse(jsonString)
        : [];
    } catch (error) {
      console.error("❌ JSON parse error:", error, "Input:", jsonString);
      return [];
    }
  }

  const requirements = safeParse(post.requirements);
  const skills = safeParse(post.skills);
  const benefits = safeParse(post.benefits);
  const technologies = safeParse(safeParse(post.technologies || "[]"));

  const languages = Array.isArray(post.languages)
    ? post.languages
    : safeParse(post.languages);

  return (
    <article className="detail-container">
      <div className="detail-content">
        <h2>{post.title}</h2>
        <div className="detail-header">
          <p>
            <IoLocationOutline /> {post.location}
          </p>
          <span>|</span>
          <p>
            <PiMoney />
            {new Intl.NumberFormat("cs-CZ").format(post.salary)} CZK
          </p>
          <span>|</span>
          <p>{post.jobContract || "Not specified"}</p>
          <span>|</span>
          <p>{post.seniority}</p>
        </div>

        {technologies.length > 0 && (
          <div>
            <h3>Technologies</h3>
            <ul className="technology-list">
              {technologies.map((tech, index) => (
                <li key={index} className="technology-item">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h3>About Position</h3> {post.content}
        </div>

        {requirements.length > 0 && (
          <div>
            <h3>Job Requirements</h3>
            <ul>
              {requirements.map((req, index) => (
                <li key={index} className="links">
                  <GoDotFill />

                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h3>Skills / Qualifications</h3>
            <ul>
              {skills.map((skill, index) => (
                <li key={index} className="links">
                  {" "}
                  <GoDotFill /> {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {user?.role === "job_seeker" && !applied && (
          <button className="apply-btn" onClick={() => setShowModal(true)}>
            Apply
          </button>
        )}
        {user?.role === "job_seeker" && applied && (
          <p>You have already applied ✅</p>
        )}

        {user?.role === "employer" && (
          <div className="applicants-container">
            <h2>Applicants</h2>
            {applicants.length > 0 ? (
              <div className="applicants-grid">
                {applicants.map((applicant) => (
                  <div key={applicant.id} className="applicant-card">
                    <div className="applicant-info">
                      <strong>{applicant.full_name}</strong>
                      <p>{applicant.email}</p>
                    </div>
                    {applicant.cv_url && (
                      <a
                        href={applicant.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-button"
                      >
                        View CV
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-applicants">No applicants yet.</p>
            )}
          </div>
        )}
      </div>

      {/* first modal - confirm your application */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Your Application</h2>
            <p>Are you sure you want to apply for this job?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmApply}>
                Yes, Apply
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* second modal - success sending */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Application Sent!</h2>
            <p>Your application has been successfully submitted. 🎉</p>
            <button
              className="confirm-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="detail-sidebar">
        <img className="detail-img" src={post.image_url} alt={post.title} />
        <p className="post-company">
          <HiOutlineBuildingOffice2 /> {post.company}
        </p>
        <div>{post.content}</div>
        <div className="sidebar-info">
          {benefits.length > 0 && (
            <div>
              <h3>Benefits</h3>
              <ul className="benefits-list">
                {benefits
                  .slice(0, showAll ? benefits.length : 2)
                  .map((benefit, index) => (
                    <li key={index} className="sidebar-btn">
                      {benefit}
                    </li>
                  ))}
                {benefits.length > 2 && !showAll && (
                  <button
                    className="sidebar-btn show-more-btn"
                    onClick={() => setShowAll(true)}
                  >
                    + Zobrazit více
                  </button>
                )}
              </ul>
            </div>
          )}
          <div className="detail-main">
            <h3>Languages</h3>
            {Array.isArray(languages) && languages.length > 0 ? (
              <ul className="languages-list">
                {languages.map((lang, index) => (
                  <li key={index} className="language-item">
                    {lang}
                  </li>
                ))}
              </ul>
            ) : (
              <span>Not specified</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
