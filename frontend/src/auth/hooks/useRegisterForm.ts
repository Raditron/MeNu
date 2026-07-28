import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCurrentUser, registerWithEmail } from "../api";
import { formatAuthError } from "../utils/formatAuthError";
import { useRegisterUser } from "./useRegisterUser";

export function useRegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useRegisterUser();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    console.log("[register] submit start", { email });
    try {
      const { user } = await registerWithEmail(email, password);
      console.log("[register] firebase user created", { uid: user.uid });
      try {
        await registerUser(user.uid, email);
        console.log("[register] backend registration succeeded", { uid: user.uid });
      } catch (backendError) {
        console.error("[register] backend registration failed, rolling back firebase user", backendError);
        await deleteCurrentUser();
        console.log("[register] rollback complete");
        throw backendError;
      }
      navigate("/menu");
    } catch (err) {
      console.error("[register] submit failed", err);
      setError(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    submitting,
    submit,
  };
}
