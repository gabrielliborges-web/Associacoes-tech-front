export function handleChangeInput<T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<T>>
) {
  const { name, type, value, checked, files } = e.target;
  if (!name) return;

  let newValue: unknown = value;

  switch (type) {
    case "number":
    case "range":
      newValue = value === "" ? "" : Number(value);
      break;
    case "checkbox":
      newValue = checked;
      break;
    case "date":
    case "datetime-local":
    case "time":
      newValue = value || "";
      break;
    case "file":
      newValue =
        files && files.length > 1 ? Array.from(files) : files?.[0] ?? null;
      break;
    case "radio":
      newValue = checked ? value : (null as unknown);
      break;
    default:
      newValue = value;
  }

  setState((prev) => ({
    ...prev,
    [name]: newValue,
  }));
}
