import "./AuthPages.css";
import { Link } from "react-router-dom";

type RegisterPageProps = {
  email: string;
  password: string;
  message: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRegister: () => void;
};

function AppleShape() {
  return (
    <svg
      className="auth-apple-svg"
      viewBox="0 0 660 620"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className="auth-apple-body"
        d="
          M330 128
          C286 72 205 58 138 90
          C66 125 48 205 70 295
          C94 395 150 482 224 535
          C268 567 306 558 330 540
          C354 558 392 567 436 535
          C510 482 566 395 590 295
          C612 205 594 125 522 90
          C455 58 374 72 330 128
          Z
        "
      />
      <path
        className="auth-apple-leaf-svg"
        d="
          M354 86
          C393 35 452 26 503 49
          C463 90 412 108 362 103
          Z
        "
      />
      <path
        className="auth-apple-stem-svg"
        d="M330 124 C332 101 341 77 354 56"
      />
    </svg>
  );
}

function RegisterPage({
  email,
  password,
  message,
  onEmailChange,
  onPasswordChange,
  onRegister,
}: RegisterPageProps) {
  return (
    <main className="auth-page">
      <div className="auth-nutrient-field" aria-hidden="true">
        <span className="auth-global-nutrient nutrient-global-b12">
          vitamin B12
        </span>
        <span className="auth-global-nutrient nutrient-global-protein">
          protein
        </span>
        <span className="auth-global-nutrient nutrient-global-magnesium">
          magnesium
        </span>
        <span className="auth-global-nutrient nutrient-global-fiber">
          fiber
        </span>
        <span className="auth-global-nutrient nutrient-global-iron">iron</span>
        <span className="auth-global-nutrient nutrient-global-calcium">
          calcium
        </span>
        <span className="auth-global-nutrient nutrient-global-potassium">
          potassium
        </span>
      </div>
      <section className="auth-brand-panel">
        <div className="auth-brand-copy">
          <div className="auth-monogram">DN</div>
          <div className="auth-wordmark">Daily Nutrition</div>
          <p>
            Track what you eat, understand your nutrients, and see what your day
            still needs.
          </p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-apple-shell">
          <AppleShape />

          <div className="auth-card auth-card-in-apple">
            <h1>Create account</h1>
            <p className="auth-subtitle">
              Start your personal nutrition record.
            </p>

            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onRegister();
              }}
            >
              <label className="auth-field">
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

              <label className="auth-field">
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

              {message && <p className="auth-message">{message}</p>}

              <button className="auth-submit-button" type="submit">
                Create account
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
