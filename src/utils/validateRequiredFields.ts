import type { Field } from "../components/common/FormsFields";

interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

export function validateRequiredFields(
  fields: Field[],
  values: Record<string, any>
): ValidationResult {
  const missingFields: string[] = [];

  fields.forEach((field) => {
    if (!field.required) return;

    const value = values[field.internalName];

    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) missingFields.push(field.label || field.internalName);
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
