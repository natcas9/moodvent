// creer postData et getData  et les utiliser ou c relevant pour le ajax 
//et ensuite creer registro pour utiliser Ajax la dans 

async function safeFetch(...options) {
    const response = await fetch(...options);
    if (!response.ok) throw new Error("Fetch failed");
    return response;
  }
  
  async function postJson(url = "", data = {}, options = {}) {
    const response = await safeFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(data),
      ...options,
    });
    return response;
  }
  