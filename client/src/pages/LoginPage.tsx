import "./AuthPages.css";
import { useState } from "react";
import { Link } from "react-router-dom";

type LoginPageProps = {
  email: string;
  password: string;
  message: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
};

function LoginPage({
  email,
  password,
  message,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="register-page">
      <section className="register-form-side">
        <div className="register-form-content login-form-content">
          <h1>Log in</h1>

          <form
            className="register-form"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin();
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

              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // 睁眼
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                    </svg>
                  ) : (
                    // 闭眼
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                      <path d="M3 15l2.5 -3.8" />
                      <path d="M21 14.976l-2.492 -3.776" />
                      <path d="M9 17l.5 -4" />
                      <path d="M15 17l-.5 -4" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {message && <p className="register-message">{message}</p>}

            <button className="register-submit-button" type="submit">
              Log in
            </button>
          </form>

          <p className="register-switch-text">
            New to Daily Nutrition? <Link to="/register">Sign up</Link>
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

export default LoginPage;
