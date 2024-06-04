import { defineStore } from 'pinia';
import axios from 'axios';

export const useCompanyStore = defineStore('companyStore', {
  state: () => ({
    companies: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCompanies() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/companies');
        this.companies = response.data.companies;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
