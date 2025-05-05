import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import TransactionDetails from "./pages/transactions";
import AccountDetails from "./pages/accounts";
import Categories from "./pages/categories";
import LoginScreen from "./pages/auth/Login";
import RootLayout from "./components/outlets/Layout";
import RegisterScreen from "./pages/auth/Register";
import ProtectedRoute from "./hoc/ProtectedRoute";
import { AuthProvider } from "./context/Auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" Component={LoginScreen} />
        <Route path="/register" Component={RegisterScreen} />
        <Route Component={ProtectedRoute}>
          <Route Component={RootLayout}>
            <Route path="/" Component={HomePage} />
            <Route path="/transactions" Component={TransactionDetails} />
            <Route path="/accounts" Component={AccountDetails} />
            <Route path="/categories" Component={Categories} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
