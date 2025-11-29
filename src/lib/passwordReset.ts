import { api } from "./api";

export const sendResetCode = async (email: string) => {
  try {
    const response = await api.post("/password-reset/send", { email });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao enviar código de redefinição:",
      error.response?.data
    );

    const apiError = error.response?.data;
    const status = error.response?.status;

    if (apiError?.errors) {
      throw { status, message: apiError.errors.join(", ") };
    }

    if (apiError?.error || apiError?.message) {
      throw { status, message: apiError.error || apiError.message };
    }

    throw { status, message: "Erro ao enviar código de redefinição de senha." };
  }
};

export const validateResetCode = async (email: string, code: string) => {
  try {
    const response = await api.get("/password-reset/validate", {
      params: { email, code },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao validar código:", error.response?.data);

    const apiError = error.response?.data;
    const status = error.response?.status;

    if (apiError?.errors) {
      throw { status, message: apiError.errors.join(", ") };
    }

    if (apiError?.error || apiError?.message) {
      throw { status, message: apiError.error || apiError.message };
    }

    throw { status, message: "Erro ao validar o código de redefinição." };
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/password-reset/reset", {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao redefinir senha:", error.response?.data);

    const apiError = error.response?.data;
    const status = error.response?.status;

    if (apiError?.errors) {
      throw { status, message: apiError.errors.join(", ") };
    }

    if (apiError?.error || apiError?.message) {
      throw { status, message: apiError.error || apiError.message };
    }

    throw { status, message: "Erro ao redefinir senha." };
  }
};
