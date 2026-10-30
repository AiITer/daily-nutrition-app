import "./AuthPages.css";
import { Link } from "react-router-dom";
import { getPasswordStrength } from "../passwordStrength";

type RegisterPageProps = {
  email: string;
  password: string;
  message: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRegister: () => void;
};

function RegisterPage({
  email,
  password,
  message,
  onEmailChange,
  onPasswordChange,
  onRegister,
}: RegisterPageProps) {
  const passwordStrength = getPasswordStrength(password);

  return (
    <main className="register-page">
      <section className="register-form-side">
        <div className="register-monogram">DN</div>

        <div className="register-form-content">
          <h1>Sign up</h1>

          <form
            className="register-form"
            onSubmit={(event) => {
              event.preventDefault();
              onRegister();
            }}
          >
            <label className="register-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="register-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                required
              />
            </label>

            {password && password.length < 8 && (
              <p className="password-requirement">
                Password must be at least 8 characters long.
              </p>
            )}

            {password.length >= 8 && (
              <p className={`password-strength ${passwordStrength}`}>
                Password strength:{" "}
                {passwordStrength.charAt(0).toUpperCase() +
                  passwordStrength.slice(1)}
                <span
                  className={`password-strength-icon ${
                    passwordStrength === "weak" ? "invalid" : "valid"
                  }`}
                  aria-hidden="true"
                >
                  {passwordStrength === "weak" ? "×" : "✓"}
                </span>
              </p>
            )}

            {message &&
              !(
                password.length < 8 &&
                message === "Password must be at least 8 characters long."
              ) && <p className="register-message">{message}</p>}

            <button className="register-submit-button" type="submit">
              Sign up
            </button>
          </form>

          <p className="register-switch-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>

      <section className="register-preview-side">
        <div className="register-preview-content">
          <header className="register-preview-heading">
            <h2>Daily Nutrition</h2>
            <p>
              Track what you eat, understand your nutrients, and see what your
              day still needs.
            </p>
          </header>

          <div className="register-preview-figure">
            <img
              src="/register-preview.svg"
              alt="Example showing a food input, its nutrients, and the nutrition still needed today"
              className="register-preview-image"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
