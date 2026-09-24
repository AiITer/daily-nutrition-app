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
  return (
    <div>
      <h1>Daily Nutrition</h1>
      <h2>Log in</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
      />

      <button onClick={onLogin}>Log in</button>

      {message && <p>{message}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
