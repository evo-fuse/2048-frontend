import { useState } from "react"

export const useOpen = (initialValue?: boolean) => {
    const [isOpen, setOpen] = useState(initialValue || false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    const onToggle = () => setOpen(!isOpen);
    return {
        isOpen,
        onOpen,
        onClose,
        onToggle
    }
}