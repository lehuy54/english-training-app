// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { login, register } from "../services/authService";
import type { LoginInput, RegisterInput } from "../types/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { getUserMe } from "../services/userService";

export const useLogin = (onSuccessCallback?: () => void) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      
      const user = await getUserMe(); // fetch user sau khi có token
      dispatch(setCredentials({ token: data.token, user }));
      
      // Execute the callback (closes the modal)
      onSuccessCallback?.();
      
      // Reload the page after a short delay to ensure Redux state is updated
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });
};

export const useRegister = (onSuccessCallback?: () => void) => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: async (_, variables) => {
      try {
        // Automatically log in after successful registration
        const loginResult = await login({ email: variables.email, password: variables.password });
        localStorage.setItem("token", loginResult.token);
        
        const user = await getUserMe();
        dispatch(setCredentials({ token: loginResult.token, user }));
        
        // Call the callback (likely to close the modal)
        onSuccessCallback?.();
        
        // Reload the page after a short delay to ensure Redux state is updated
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error("Auto-login after registration failed:", error);
      }
    },
    onError: (err) => {
      console.error("Register error:", err);
    },
  });
};
