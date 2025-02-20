"use client";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { FaRegUser } from "react-icons/fa6";

export default function HeaderClient() {
  const { user, setUser, fetchUser, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "POST" });

    if (response.ok) {
      setUser(null);
      router.refresh();
    } else {
      console.error("Failed to logout");
    }
  };

  if (loading) return null;

  return (
    <header id="main-header">
      <Link href="/">
        <img src={logo.src} alt="Mobile phone with posts feed on it" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          {user?.role === "employer" && (
            <li>
              <Link href="/new-post">New Post</Link>
            </li>
          )}
          {user?.role === "job_seeker" && (
            <li className="profile-link">
              <Link href="/profile" className="profile-link-container">
                <FaRegUser className="profile-icon" />
                <span>My Profile</span>
              </Link>
            </li>
          )}

          {user ? (
            <li>
              <button className="btn-logout text-xl" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login-form">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
