import express from "express"
import cors from "cors"
import "dotenv/config"
import { normalizeUsdaNutrients } from "./nutrition/normalizeUsdaNutrients.js"
import { calculateFoodIntake } from "./nutrition/calculateFoodIntake.js"

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
    return res.status(400).json({
      error: "Search query is required"
    })
  }

  const apiKey = process.env.USDA_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured"
    })
  }

  const url = new URL(
    "https://api.nal.usda.gov/fdc/v1/foods/search"
  )

  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("query", query)
  url.searchParams.set("pageSize", "20")

  const response = await fetch(url)
  console.log("USDA search request:", query)

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Failed to search USDA foods"
    })
  }

  const data = await response.json()
  const foods = data.foods ?? []

  const selectedFood =
    foods.find((food: any) => food.dataType === "Foundation") ??
    foods.find((food: any) => food.dataType === "SR Legacy") ??
    foods.find((food: any) => food.dataType === "Survey (FNDDS)")

  if (!selectedFood) {
    return res.status(404).json({
      error: "No generic food found"
    })
  }

  const nutrients = normalizeUsdaNutrients(
    selectedFood.foodNutrients ?? []
  )

  const grams = Number(req.query.grams) || 100

  const intake = calculateFoodIntake(
    nutrients,
    grams
  )

  res.json({
    name: query.trim(),
    grams,
    fdcId: selectedFood.fdcId,
    usdaDescription: selectedFood.description,
    nutrients: intake
  })
})

app.get("/api/debug/usda", async (req, res) => {
  const query = req.query.q

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      error: "Search query is required"
    })
  }

  const apiKey = process.env.USDA_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured"
    })
  }

  const url = new URL(
    "https://api.nal.usda.gov/fdc/v1/foods/search"
  )

  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("query", query)
  url.searchParams.set("pageSize", "10")

  const response = await fetch(url)

  if (!response.ok) {
    return res.status(response.status).json({
      error: "USDA request failed"
    })
  }

  const data = await response.json()

  const results = (data.foods ?? []).map((food: any) => ({
    fdcId: food.fdcId,
    description: food.description,
    dataType: food.dataType,
    nutrients: (food.foodNutrients ?? []).map((nutrient: any) => ({
      id: nutrient.nutrientId,
      name: nutrient.nutrientName,
      unit: nutrient.unitName,
      value: nutrient.value
    }))
  }))

  res.json(results)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})