import { toast, ToastOptions } from "react-toastify";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import React from "react";

type ToastType = "error" | "success" | "info";

const createToastContent = (
  title: string,
  message?: string,
  type: ToastType = "info"
): React.ReactNode => {
  const iconMap = {
    error: <MdError color="red" size={24} />,
    success: <MdCheckCircle color="green" size={24} />,
    info: <MdInfo color="blue" size={24} />
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="flex items-center text-lg gap-2">
        {iconMap[type]}
        <span className="text-white">{title}</span>
      </span>
      {message && <span className="text">{message}</span>}
    </div>
  );
};

export const Toast = {
  error: (title: string, message?: string, options?: ToastOptions) => 
    toast.error(createToastContent(title, message, "error"), options),
  
  success: (title: string, message?: string, options?: ToastOptions) => 
    toast.success(createToastContent(title, message, "success"), options),
  
  info: (title: string, message?: string, options?: ToastOptions) => 
    toast.info(createToastContent(title, message, "info"), options)
};
