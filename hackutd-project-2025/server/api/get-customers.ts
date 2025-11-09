export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
  const apiKey = config.nessieApiKey; 
  const baseUrl = 'https://api.nessieisreal.com';
    const endpoint = `/customer`;
  
  const requestUrl = `${baseUrl}${endpoint}?key=${apiKey}`;

  try {

    const customers = await $fetch(requestUrl);
    return customers;
  } catch (error: any) {
    console.error('Error fetching customers from Nessie API:', error);
    return {
      error: 'Failed to fetch customer data',
      details: error.message
    };
  }
});