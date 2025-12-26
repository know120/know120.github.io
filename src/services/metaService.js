const fetchAdCampaigns = async (accessToken, countryCode) => {
  // The new URL points to our local proxy, which will forward the request to graph.facebook.com
  // This avoids CORS issues in the browser.
  // NOTE: For production, the access token should be handled by a secure backend, not passed from the client.
  const url = `https://graph.facebook.com/v23.0/ads_archive?access_token=${accessToken}&ad_reached_countries=['${countryCode}']&ad_type=POLITICAL_AND_ISSUE_ADS&fields=id,page_name,spend,impressions,ad_delivery_start_time&limit=100`;
  const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  const response = await fetch(proxyUrl);
  const data = await response.json();

  if (!response.ok || data.error) {
    // Create a new error object with a message from the API, or a default one.
    const error = new Error(data.error?.message || `Request failed with status ${response.status}`);
    error.details = data.error; // Attach full error details
    throw error;
  }

  // On success, return the data array.
  return data.data || [];
};


const API_KEY = 'EAAHjPAzkZCH0BPWMMFV9WJv4k0W9v4voX6SSUzsznBvMkHiKlXKT6U6NlKEe0vfEMpJzbPHYbVKwE04FeZBDlvkBnjBggwOncMd6U4ynfxpKucyZAFnaUK9PlvneeVS5xZCSfZAgFt9vb0DA34hHZAOy1CWyMI6iYhvH6e32ofnm9I0zGAecKoJwKzOjo1IrrmgQJGEcVcVGBTvXrQZA2NBrBdbdCVpD4W2ouUmr3FIHwZDZD'; // Replace with your ScrapeCreators API key
const getData = async () => {
  const params = new URLSearchParams({
    access_token: API_KEY,
    ad_reached_countries: "IN", // Replace as needed; comma-separated
    search_terms: "shoes", // Search keyword or leave blank for all
  });
  const response = await fetch(`https://graph.facebook.com/v19.0/ads_archive?${params}`);
  const data = await response.json();
  console.log(data);
}

export { fetchAdCampaigns, getData }