export const useRegisterUser = () => {
  const registerUser = async (uid: string, email: string) => {
    console.log("[registerUser] POST /api/users/register", { uid, email });
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, email }),
    });

    console.log("[registerUser] response received", {
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error("[registerUser] backend returned error", error);
      throw new Error(error ?? "Error registering user");
    }

    const result = await response.json();
    console.log("[registerUser] backend returned success", result);
    return result;
  };

  return { registerUser };
};
