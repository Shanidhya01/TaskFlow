"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setForm({ name: data.name, email: data.email });
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          <button
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-destructive font-medium px-4 py-2 rounded-lg hover:bg-destructive/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-fade-in">
          {/* Cover/Header */}
          <div className="h-32 bg-linear-to-br from-primary via-primary/80 to-secondary relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          </div>

          {/* Avatar */}
          <div className="px-6 sm:px-8 -mt-12 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-card">
              {initials}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 sm:px-8 pt-4 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  {user?.name}
                </h1>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Member since {memberSince}
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-xl hover:bg-primary-hover shadow-sm hover:shadow-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 animate-scale-in">
            <h2 className="text-lg font-semibold text-card-foreground mb-6">
              Edit Profile
            </h2>

            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-card-foreground mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-card-foreground placeholder:text-muted-foreground focus:bg-card focus:border-primary/50 focus:shadow-md transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-card-foreground mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-card-foreground placeholder:text-muted-foreground focus:bg-card focus:border-primary/50 focus:shadow-md transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    if (user) setForm({ name: user.name, email: user.email });
                    setError("");
                  }}
                  className="px-6 py-3 text-muted-foreground font-medium rounded-xl hover:bg-muted hover:text-card-foreground transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 animate-fade-in delay-100">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Account Information
          </h2>
          <dl className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground sm:w-32">User ID</dt>
              <dd className="text-sm text-card-foreground font-mono bg-muted px-3 py-1.5 rounded-lg mt-1 sm:mt-0">
                {user?._id}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground sm:w-32">Name</dt>
              <dd className="text-sm text-card-foreground mt-1 sm:mt-0">{user?.name}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground sm:w-32">Email</dt>
              <dd className="text-sm text-card-foreground mt-1 sm:mt-0">{user?.email}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <dt className="text-sm font-medium text-muted-foreground sm:w-32">Joined</dt>
              <dd className="text-sm text-card-foreground mt-1 sm:mt-0">{memberSince}</dd>
            </div>
          </dl>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-card rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-6 sm:p-8 animate-fade-in delay-200">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you sign out, you will need to log in again to access your tasks.
          </p>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive/10 text-destructive font-medium text-sm rounded-xl border border-destructive/20 hover:bg-destructive/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out of TaskFlow
          </button>
        </div>
      </main>
    </div>
  );
}
