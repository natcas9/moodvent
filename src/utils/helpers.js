export function error(errores, propiedad) {
  if (errores && propiedad in errores) {
    return `<span class="error">${errores[propiedad].msg}</span>`;
  }
  return "";
}
