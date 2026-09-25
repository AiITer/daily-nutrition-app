import "./WelcomePage.css";

type WelcomePageProps = {
  onSkip: () => void;
  onCompleteProfile: () => void;
  onBackToLogin: () => void;
};

function WelcomePage({
  onSkip,
  onCompleteProfile,
  onBackToLogin,
}: WelcomePageProps) {
  return (
    <main className="welcome-page">
      <div className="welcome-stage">
        <div className="welcome-blue-layer" aria-hidden="true" />

        <section className="welcome-card">
          <h1>Welcome</h1>

          <p className="welcome-lead">Your account is ready.</p>

          <p className="welcome-copy">
            Complete your profile to get personalized daily nutrition targets,
            or skip for now and explore the app first.
          </p>

          <div className="welcome-actions">
            <button
              className="welcome-button welcome-button-secondary"
              type="button"
              onClick={onSkip}
            >
              Skip for now
            </button>

            <button
              className="welcome-button welcome-button-primary"
              type="button"
              onClick={onCompleteProfile}
            >
              Complete Profile
            </button>
          </div>

          <button
            className="welcome-back-login"
            type="button"
            onClick={onBackToLogin}
          >
            Back to Log in
          </button>
        </section>
      </div>
    </main>
  );
}

export default WelcomePage;
