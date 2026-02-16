"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Props {
  onLogout: () => void;
}

export default function ProfileCard({ onLogout }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (editing) {
          setEditing(false);
          if (user) setForm({ name: user.name, email: user.email });
          setError("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, user]);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setForm({ name: data.name, email: data.email });
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Update failed");
        return;
      }

      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all"
        title="Profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {user ? initials : (
            <div className="w-4 h-4 rounded-full bg-white/30 animate-pulse" />
          )}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl border border-border shadow-lg z-50 animate-scale-in overflow-hidden">
          {success && (
            <div className="px-4 pt-3">
              <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 pt-3">
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {editing ? (
            <form onSubmit={saveProfile} className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-card-foreground">Edit Profile</h3>
              <div>
                <label htmlFor="profile-name" className="block text-xs font-medium text-muted-foreground mb-1">
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-card-foreground text-sm focus:bg-card"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-xs font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted/50 text-card-foreground text-sm focus:bg-card"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    if (user) setForm({ name: user.name, email: user.email });
                    setError("");
                  }}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Profile info */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-card-foreground text-sm truncate">
                    {user?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <div className="border-t border-border">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-2.5 text-sm text-left text-card-foreground hover:bg-muted transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <button
                  onClick={() => { setEditing(true); setError(""); setSuccess(""); }}
                  className="w-full px-4 py-2.5 text-sm text-left text-card-foreground hover:bg-muted transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Quick Edit
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2.5 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
