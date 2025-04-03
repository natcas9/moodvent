
document.getElementById("openProfileBtn").onclick = async function() {
    document.getElementById("profileModal").style.display = "block";
    
    // Obtener datos del usuario desde el servidor
    const response = await fetch('/api/usuario');
    const userData = await response.json();
    
    document.getElementById("userName").innerText = userData.nombre;
    document.getElementById("userEmail").innerText = userData.email;
    
    const historyList = document.getElementById("userHistory");
    historyList.innerHTML = ""; // Limpiar lista
    userData.historial.forEach(entry => {
        let li = document.createElement("li");
        li.textContent = entry;
        historyList.appendChild(li);
    });
    
    document.getElementById("moodSelector").value = userData.estado_animo;
};

document.querySelector(".close").onclick = function() {
    document.getElementById("profileModal").style.display = "none";
};
window.onclick = function(event) {
    if (event.target === document.getElementById("profileModal")) {
        document.getElementById("profileModal").style.display = "none";
    }
};

document.getElementById("logoutBtn").onclick = async function() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
};
