import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session.user;
  
  if (!user) {
    redirect("/login");
  }

  // 1. If the user is active, automatically redirect them to their specific dashboard
  if (user.status === "active") {
    if (user.role === "mentor") {
      redirect("/mentor/dashboard");
    } else if (user.role === "mentee") {
      redirect("/mentee/dashboard");
    } else if (user.role === "admin") {
      redirect("/admin/dashboard");
    }
  }

  // 2. If they are pending, show this waiting screen
  return (
    <main className="container py-5">
      <section className="card mx-auto p-4 shadow-sm border-0" style={{ maxWidth: 680 }}>
        <span className="text-muted fw-bold" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
          MENTORMATCH
        </span>
        <h1 className="mt-2 fw-bold">Welcome, {user.name}</h1>
        
        <p className="text-muted mb-4">
          Your {user.role} account is <strong className="text-dark">{user.status}</strong>. 
          {user.status === "pending" && " Please wait for an administrator to approve your account."}
        </p>
        
        <div className="d-flex flex-wrap gap-3">
          {/* Since we added the redirect above, active users never see this page. 
              Only pending users see this. */}
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline-secondary px-4 py-2">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}