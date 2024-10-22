export async function get(endpoint, queryParams) {
  let url = endpoint;

  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url = url.concat("?", queryString);
  }

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

export async function post(endpoint, payload) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
