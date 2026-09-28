// NutriSnap storage utilities - localStorage based

const KEYS = {
  USER: 'ns_user',
  PRODUCTS: 'ns_products',
  MEALS: 'ns_meals',
  DAILY_LOG: 'ns_daily_log',
  CUSTOM_FIELDS: 'ns_custom_fields',
};

export const storage = {
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PRODUCTS)) || [];
    } catch {
      return [];
    }
  },

  saveProducts(products) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getMeals() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.MEALS)) || [];
    } catch {
      return [];
    }
  },

  saveMeals(meals) {
    localStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
  },

  getDailyLog(date) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.DAILY_LOG)) || {};
      return all[date] || [];
    } catch {
      return [];
    }
  },

  saveDailyLog(date, entries) {
    const all = JSON.parse(localStorage.getItem(KEYS.DAILY_LOG)) || {};
    all[date] = entries;
    localStorage.setItem(KEYS.DAILY_LOG, JSON.stringify(all));
  },

  getCustomFields() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CUSTOM_FIELDS)) || [];
    } catch {
      return [];
    }
  },

  saveCustomFields(fields) {
    localStorage.setItem(KEYS.CUSTOM_FIELDS, JSON.stringify(fields));
  },

  getProduct(id) {
    return this.getProducts().find((p) => p.id === id);
  },

  addProduct(product) {
    const products = this.getProducts();
    const existing = products.findIndex((p) => p.name === product.name && p.brand === product.brand);
    if (existing >= 0) {
      products[existing] = { ...products[existing], ...product, updatedAt: Date.now() };
    } else {
      products.push({ ...product, id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveProducts(products);
    return products[existing >= 0 ? existing : products.length - 1];
  },

  deleteProduct(id) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },
};

export function getToday() {
  return new Date().toISOString().split('T')[0];
}
