import { useState } from "react";

export const useClipboard = (
  clipboardText: string,
  originalContent: React.ReactNode,
  changeContent: React.ReactNode,
) => {
  const [content, setContent] = useState(originalContent);
  const [isCopied, setIsCopied] = useState(false);
  const onClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clipboardText)
        .then(() => {
          setIsCopied(true);
          setContent(changeContent);
          setTimeout(() => {
            setContent(originalContent);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } else {
      console.error('Clipboard API not available');
    }
  };
  return { onClick, content, isCopied };
};
