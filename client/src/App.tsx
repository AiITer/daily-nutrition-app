import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("checking...");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return <h1>API status: {status}</h1>;
}

export default App;
