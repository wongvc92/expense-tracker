import "./App.css";
import { Route, Routes } from "react-router";
import AuthLayout from "./components/auth/AuthLayout";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import VerifyEmailPage from "./components/auth/VerifyEmailPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import NewPasswordPage from "./components/auth/NewPasswordPage";
import RequireAuth from "./components/auth/RequireAuth";
import HomePage from "./components/home/HomePage";
import PageNotFound from "./components/common/PageNotFound";
import SettingsPage from "./components/auth/SettingsPage";
import VerifyEmailChangePage from "./components/auth/VerifyEmailChangePage";
import AddExpensePage from "./components/expense/AddExpensePage";

function App() {
  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
          <Route path="verify-email-change" element={<VerifyEmailChangePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="/expenses/add" element={<AddExpensePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
