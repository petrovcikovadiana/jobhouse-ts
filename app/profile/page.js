"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

export default function JobSeekerProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user || !user.id) {
      console.log("⏳ Waiting for user data...");
      return;
    }

    async function fetchProfile() {
      try {
        console.log("📡 Fetching profile for userId:", user.id);

        const response = await fetch("/api/job-seeker/profile", {
          headers: { userId: user.id },
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data.profile);
          setApplications(data.applications);
        } else {
          console.error("❌ Profile API error:", data.error);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    router.refresh();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>Job Seeker Profile</h1>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        {profile.cv_url && (
          <p>
            <strong>CV:</strong>{" "}
            <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
              View CV
            </a>
          </p>
        )}
      </div>

      <h2>Applied jobs</h2>
      {applications.length > 0 ? (
        <div className="applications-grid">
          {applications.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => router.push(`/feed/${job.id}`)}
            >
              <h3>{job.title}</h3>
              <p>
                <strong className="post-company">{job.company}</strong>
              </p>
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
            </div>
          ))}
        </div>
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}
