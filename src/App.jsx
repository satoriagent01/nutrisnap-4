import { useState, useEffect } from 'react'
import Header from './components/Header'
import Camera from './components/Camera'
import NutritionSummary from './components/NutritionSummary'
import MealPlanner from './components/MealPlanner'
import Dashboard from './components/Dashboard'
import { loadProducts, loadMeals, loadGoals, saveProducts, saveMeals, saveGoals } from './utils/storage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [meals, setMeals] = useState([])
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  })
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    const savedProducts = loadProducts()
    const savedMeals = loadMeals()
    const savedGoals = loadGoals()
    if (savedProducts) setProducts(savedProducts)
    if (savedMeals) setMeals(savedMeals)
    if (savedGoals) setGoals(savedGoals)
  }, [])

  const handleProductSave = (product) => {
    const updated = [...products]
    const idx = updated.findIndex(p => p.id === product.id)
    if (idx >= 0) {
      updated[idx] = product
    } else {
      updated.push(product)
    }
    setProducts(updated)
    saveProducts(updated)
    setActiveTab('dashboard')
    setEditingProduct(null)
  }

  const handleProductDelete = (id) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveProducts(updated)
  }

  const handleMealSave = (meal) => {
    const updated = [...meals]
    const idx = updated.findIndex(m => m.id === meal.id)
    if (idx >= 0) {
      updated[idx] = meal
    } else {
      updated.push(meal)
    }
    setMeals(updated)
    saveMeals(updated)
  }

  const handleMealDelete = (id) => {
    const updated = meals.filter(m => m.id !== id)
    setMeals(updated)
    saveMeals(updated)
  }

  const handleGoalsSave = (newGoals) => {
    setGoals(newGoals)
    saveGoals(newGoals)
  }

  const handleScanComplete = (product) => {
    setEditingProduct(product)
    setActiveTab('scan')
  }

  return (
    <div className="min-h-screen bg-light">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            products={products}
            meals={meals}
            goals={goals}
            onProductDelete={handleProductDelete}
            onMealDelete={handleMealDelete}
            onScanNew={() => setActiveTab('scan')}
          />
        )}
        {activeTab === 'scan' && (
          <Camera
            onScanComplete={handleScanComplete}
            existingProducts={products}
          />
        )}
        {activeTab === 'edit' && editingProduct && (
          <NutritionSummary
            product={editingProduct}
            onSave={handleProductSave}
            onCancel={() => { setActiveTab('dashboard'); setEditingProduct(null); }}
          />
        )}
        {activeTab === 'meals' && (
          <MealPlanner
            products={products}
            meals={meals}
            goals={goals}
            onSaveMeal={handleMealSave}
            onDeleteMeal={handleMealDelete}
          />
        )}
      </main>
    </div>
  )
}

export default App
