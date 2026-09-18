import { useState } from "react";

function App() {
  const [email, setEmail] = useState("luna@example.com");
  const [password, setPassword] = useState("test123456");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [foodHistory, setFoodHistory] = useState<any[]>([]);
  const [historyTab, setHistoryTab] = useState<"foods" | "nutrition" | null>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);

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

      const daysResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/days`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const daysData = await daysResponse.json();
      setDays(daysData.days);

      const foodHistoryResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/history/foods`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const foodHistoryData = await foodHistoryResponse.json();

      setFoodHistory(foodHistoryData.foods);

      setMessage("Login successful");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setProfile(null);
    setDays([]);
    setFoodHistory([]);
    setSelectedDay(null);
    setHistoryTab(null);
    setMessage("Logged out");
  }

  async function loadDayDetails(daySessionId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${daySessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to load day");
      return;
    }

    setSelectedDay(data);
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
      {profile && <button onClick={handleLogout}>Log out</button>}

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
      {profile && (
        <div>
          <h2>History</h2>

          <button onClick={() => setHistoryTab("foods")}>Food Entries</button>

          <button onClick={() => setHistoryTab("nutrition")}>
            Daily Nutrition
          </button>
          {historyTab === "foods" && (
            <div>
              {foodHistory.map((food) => (
                <div key={food.id}>
                  <p>
                    {food.food_name} — {food.amount} {food.unit}
                  </p>

                  <p>{new Date(food.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {historyTab === "nutrition" && (
            <div>
              {days.map((day) => (
                <button key={day.id} onClick={() => loadDayDetails(day.id)}>
                  {day.session_date.slice(0, 10)}
                </button>
              ))}

              {selectedDay && (
                <div>
                  <h3>{selectedDay.day.session_date.slice(0, 10)}</h3>

                  {selectedDay.nutritionStatus.map((nutrient: any) => (
                    <p key={nutrient.nutrientKey}>
                      {nutrient.nutrientKey}: {nutrient.consumed}{" "}
                      {nutrient.unit}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
