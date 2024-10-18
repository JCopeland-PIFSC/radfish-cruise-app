export async function get(endpoint, queryParams) {
  let url = endpoint;

  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url = url.concat("?", queryString);
  };

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "text/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
