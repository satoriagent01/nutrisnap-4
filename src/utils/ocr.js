// OCR utilities using Tesseract.js

import Tesseract from 'tesseract.js';

export async function extractNutritionFromImage(file) {
  const result = await Tesseract.recognize(file, 'spa', {
    logger: () => {},
  });

  const text = result.data.text;
  const parsed = parseNutritionText(text);
  return parsed;
}

function parseNutritionText(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const nutrition = {
    calories: null,
    totalFat: null,
    saturatedFat: null,
    transFat: null,
    cholesterol: null,
    sodium: null,
    totalCarbs: null,
    dietaryFiber: null,
    sugars: null,
    protein: null,
    servingSize: null,
    servingUnit: null,
    per: 'porcion',
  };

  const lower = text.toLowerCase();

  // Try to find serving size
  const servingMatch = text.match(/(porcion|porción|serving)[^\n]*/i);
  if (servingMatch) {
    nutrition.servingSize = servingMatch[0].replace(/(porcion|porción|serving)/i, '').trim();
  }

  // Parse each line for nutrition values
  for (const line of lines) {
    const l = line.toLowerCase();

    // Calorías
    const calMatch = l.match(/calor(?:ías|ias)?\s*[=:]\s*(\d+[.,]?\d*)/);
    if (calMatch) {
      nutrition.calories = parseFloat(calMatch[1].replace(',', '.'));
      continue;
    }

    // Grasas totales
    const fatMatch = l.match(/(?:grasas?|total fat)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (fatMatch) {
      nutrition.totalFat = parseFloat(fatMatch[1].replace(',', '.'));
      continue;
    }

    // Grasas saturadas
    const satFatMatch = l.match(/(?:grasas? saturadas?|saturated fat)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (satFatMatch) {
      nutrition.saturatedFat = parseFloat(satFatMatch[1].replace(',', '.'));
      continue;
    }

    // Grasas trans
    const transMatch = l.match(/(?:grasa trans|trans fat)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (transMatch) {
      nutrition.transFat = parseFloat(transMatch[1].replace(',', '.'));
      continue;
    }

    // Colesterol
    const cholMatch = l.match(/colesterol[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (cholMatch) {
      nutrition.cholesterol = parseFloat(cholMatch[1].replace(',', '.'));
      continue;
    }

    // Sodio
    const sodMatch = l.match(/(?:sodio|sodium)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (sodMatch) {
      nutrition.sodium = parseFloat(sodMatch[1].replace(',', '.'));
      continue;
    }

    // Carbohidratos
    const carbMatch = l.match(/(?:carbohidratos?|total carbs?)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (carbMatch) {
      nutrition.totalCarbs = parseFloat(carbMatch[1].replace(',', '.'));
      continue;
    }

    // Fibra
    const fiberMatch = l.match(/(?:fibra|dietary fiber)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (fiberMatch) {
      nutrition.dietaryFiber = parseFloat(fiberMatch[1].replace(',', '.'));
      continue;
    }

    // Azúcares
    const sugarMatch = l.match(/(?:azúcares?|sugars?)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (sugarMatch) {
      nutrition.sugars = parseFloat(sugarMatch[1].replace(',', '.'));
      continue;
    }

    // Proteínas
    const protMatch = l.match(/(?:proteínas?|protein)[^\n]*[=:]\s*(\d+[.,]?\d*)/);
    if (protMatch) {
      nutrition.protein = parseFloat(protMatch[1].replace(',', '.'));
      continue;
    }
  }

  return nutrition;
}
