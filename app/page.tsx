import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex flex-col">
      {/* Nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white bg-linear-to-r from-primary to-primary-hover px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Simple. Fast. Organized.
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
            Manage tasks
            <br />
            <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A beautifully simple task management dashboard with secure authentication.
            Stay organized, stay productive.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-linear-to-r from-primary to-primary-hover px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all"
            >
              Start for free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-card-foreground bg-card border border-border px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
            >
              I have an account
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all">
              <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">Secure Auth</h3>
              <p className="text-sm text-muted-foreground">JWT-based authentication with encrypted passwords.</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Built with Next.js for optimized performance.</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">Smart Search</h3>
              <p className="text-sm text-muted-foreground">Instantly filter and find tasks with live search.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TaskFlow. Built with Next.js &amp; Tailwind CSS.
      </footer>
    </main>
  );
}
