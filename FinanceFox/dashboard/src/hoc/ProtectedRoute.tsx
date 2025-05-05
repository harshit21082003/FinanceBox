import { useAuth } from "@/context/Auth";
import { CloudDownload } from "akar-icons";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-4xl font-semibold animate-bounce">
        <CloudDownload size={36} />
        &nbsp;Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}
