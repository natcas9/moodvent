document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM loaded");
  const formRegistro = document.forms.namedItem('registro');
  if (!formRegistro) {
    console.warn("❌ No form[name='registro'] found");
    return;
  }

  const username = formRegistro.elements.namedItem('username');
  if (!username) {
    console.warn("❌ No input[name='username'] found");
    return;
  }

  username.addEventListener('input', usernameDisponible);
  console.log("✅ Event listener added to username");
});

/**
 * Validación de disponibilidad del nombre de usuario
 */
async function usernameDisponible(e) {
  console.log("✅ usernameDisponible() called");

  const username = e.target;
  const icono = document.getElementById("icono-username");
  const feedback = username.form.querySelector(`*[name="${username.name}"] ~ .feedback`);

  try {
    username.setCustomValidity('');
    feedback.textContent = '';

    if (username.value === '') {
      icono.textContent = '';
      return;
    }

    const response = await postJson('/usuarios/api/usuarios/disponible', {
      username: username.value
    });

    const result = await response.json();

    if (result.available === true) {
      icono.textContent = "✔";
      icono.style.color = "green";
      feedback.textContent = '';
    } else {
      icono.textContent = "⚠";
      icono.style.color = "red";
      feedback.textContent = 'El nombre de usuario ya está utilizado';
      username.setCustomValidity("El nombre de usuario ya está utilizado");
    }

    username.reportValidity();

  } catch (err) {
    console.error(`Error en validación username:`, err);
  }
}
