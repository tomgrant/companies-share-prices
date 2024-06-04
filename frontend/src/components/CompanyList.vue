<template>
    <div>
        <h1>Company List</h1>

        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <ul v-if="companies.length">
            <li v-for="company in companies" :key="company.id">
                <h2>{{ company.name }} ({{ company.unique_symbol }})</h2>
                <p>Score: {{ company.score }}</p>
                <p>Last Known Price: {{ company.lastKnownPrice }} {{ company.listing_currency_iso }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { useCompanyStore } from '../stores/companyStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export default {
    name: 'CompanyList',
    setup() {
        const companyStore = useCompanyStore();
        const { companies, loading, error } = storeToRefs(companyStore);

        onMounted(() => {
            companyStore.fetchCompanies();
        });

        return {
            companies,
            loading,
            error,
        };
    },
};
</script>
  
<style scoped>
h1 {
    font-size: 24px;
}
h2 {
    font-size: 20px;
}
p {
    font-size: 16px;
}
ul {
    list-style: none;
}
</style>
  