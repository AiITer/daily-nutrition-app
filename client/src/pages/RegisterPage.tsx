import { Link } from "react-router-dom";

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
  return (
    <div>
      <h1>Daily Nutrition</h1>
      <h2>Create account</h2>

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

      <button onClick={onRegister}>Create account</button>

      {message && <p>{message}</p>}

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
