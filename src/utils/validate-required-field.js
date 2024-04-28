export function validateRequiredField(field) {
  return !field || field.trim().length === 0
}