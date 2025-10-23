import Button from "@/app/_components/button";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({
    children,
    open = false,
    setOpen,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Transition show={open} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0"
                onClose={close}
            >
                {/* Overlay */}
                <TransitionChild
                    enter="ease-out duration-400"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-400"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/75" />
                </TransitionChild>

                {/* Panel */}
                <TransitionChild
                    enter="ease-out duration-400"
                    enterFrom="-translate-y-10 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="ease-in duration-400"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-10 opacity-0"
                >
                    <DialogPanel
                        className={`relative transform overflow-hidden rounded-lg bg-white p-5 shadow-xl transition-all sm:my-8 sm:w-full ${maxWidthClass}`}
                    >
                        {closeable && (
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        )}
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
