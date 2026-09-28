// Meal planner utilities

import { storage, getToday } from './storage.js';

export function addMealEntry(date, entry) {
  const log = storage.getDailyLog(date);
  const newEntry = {
    id: crypto.randomUUID(),
    ...entry,
    timestamp: Date.now(),
  };
  log.push(newEntry);
  storage.saveDailyLog(date, log);
  return newEntry;
}

export function removeMealEntry(date, entryId) {
  const log = storage.getDailyLog(date);
  const filtered = log.filter((e) => e.id !== entryId);
  storage.saveDailyLog(date, filtered);
}

export function getDaySummary(date) {
  const log = storage.getDailyLog(date);
  const summary = {
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0,
    entries: log,
  };

  for (const entry of log) {
    const n = entry.nutrition || {};
    summary.calories += n.calories || 0;
    summary.totalFat += n.totalFat || 0;
    summary.saturatedFat += n.saturatedFat || 0;
    summary.transFat += n.transFat || 0;
    summary.cholesterol += n.cholesterol || 0;
    summary.sodium += n.sodium || 0;
    summary.totalCarbs += n.totalCarbs || 0;
    summary.dietaryFiber += n.dietaryFiber || 0;
    summary.sugars += n.sugars || 0;
    summary.protein += n.protein || 0;
  }

  return summary;
}

export function getCustomFields() {
  return storage.getCustomFields();
}

export function saveCustomFields(fields) {
  storage.saveCustomFields(fields);
}

export function addCustomField(name, unit) {
  const fields = getCustomFields();
  if (!fields.find((f) => f.name === name)) {
    fields.push({ id: crypto.randomUUID(), name, unit: unit || '' });
    saveCustomFields(fields);
  }
  return fields;
}

export function removeCustomField(id) {
  const fields = getCustomFields().filter((f) => f.id !== id);
  saveCustomFields(fields);
  return fields;
}
