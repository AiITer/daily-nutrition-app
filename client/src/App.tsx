import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);

  async function handleLogin() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      const profileResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const profileData = await profileResponse.json();

      setProfile(profileData.profile);

      setMessage("Login successful");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  }

  return (
    <div>
      <h1>Daily Nutrition</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button onClick={handleLogin}>Log in</button>

      <p>{message}</p>
      {profile && (
        <div>
          <h2>Profile</h2>
          <p>Age: {profile.age}</p>
          <p>Sex: {profile.sex}</p>
          <p>Height: {profile.height_cm} cm</p>
          <p>Weight: {profile.weight_kg} kg</p>
          <p>Activity: {profile.activity_level}</p>
        </div>
      )}
    </div>
  );
}

export default App;
