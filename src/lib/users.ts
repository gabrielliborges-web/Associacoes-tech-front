import { api } from "./api";

export const updateUserTheme = async (theme: "LIGHT" | "DARK") => {
  try {
    const response = await api.put("/user/theme", { theme });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar tema:", error.response?.data);

    const apiError = error.response?.data;
    const status = error.response?.status;

    if (apiError?.errors) {
      throw { status, message: apiError.errors.join(", ") };
    }

    if (apiError?.error) {
      throw { status, message: apiError.error };
    }

    throw { status, message: "Erro ao atualizar tema do usuário." };
  }
};
