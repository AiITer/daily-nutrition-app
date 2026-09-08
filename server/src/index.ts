import express from "express"
import cors from "cors"
import "dotenv/config"

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.get("/api/foods/search", async (req, res) => {
  const query = req.query.q

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "Search query is required" })
  }

  const apiKey = process.env.USDA_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: "USDA API key is not configured" })
  }

  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search")
  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("query", query)

  const response = await fetch(url)
  const data = await response.json()

  res.json(data)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})