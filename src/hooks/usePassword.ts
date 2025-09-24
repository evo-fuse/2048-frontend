import { useState } from "react";

export const usePassword = () => {
  const [pwd, setPwd] = useState({
    password: { value: "", error: "" },
    cPassword: { value: "", error: "" },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curValue = e.target.value;
    setPwd({
      ...pwd,
      password: {
        value: curValue,
        error:
          curValue.length === 0
            ? ""
            : curValue.length < 8
            ? "Password length should be longer than 8."
            : "",
      },
    });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const curValue = e.target.value;
    setPwd({
      ...pwd,
      cPassword: {
        value: curValue,
        error: curValue === pwd.password.value ? "" : "Password doesn't match",
      },
    });
  };
  return { pwd, handlePasswordChange, handleConfirmPasswordChange };
};
