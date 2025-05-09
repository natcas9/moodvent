export function escapeLikePattern(text) {
  return text.replace(/[%_\\]/g, (char) => "\\" + char);
}
