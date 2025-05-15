usernameInput.addEventListener("blur", async () => {
    const username = usernameInput.value.trim();
  
    if (!username) {
      statusSpan.textContent = "";
      return;
    }
  
    try {
      const response = await fetch("/api/usuarios/disponible", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
  
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response JSON:", result);
  
      const { available, error } = result;
  
      if (error) {
        statusSpan.textContent = "⚠ Error: " + error;
        statusSpan.style.color = "orange";
      } else if (available) {
        statusSpan.textContent = "✅ Disponible";
        statusSpan.style.color = "green";
      } else {
        statusSpan.textContent = "❌ Ya está en uso";
        statusSpan.style.color = "red";
      }
    } catch (err) {
      console.error("Caught exception:", err);
      statusSpan.textContent = "⚠ Error";
      statusSpan.style.color = "orange";
    }
  });
  