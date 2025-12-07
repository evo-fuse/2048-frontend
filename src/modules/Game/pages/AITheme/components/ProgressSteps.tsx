import { IoCheckmarkCircle } from "react-icons/io5";
import { Step } from "../types";
import { STEPS, STEP_KEYS } from "../constants";

interface ProgressStepsProps {
    currentStep: Step;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
    const currentStepIdx = STEP_KEYS.indexOf(currentStep);

    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            {STEPS.map((stepItem, idx) => {
                const stepIdx = STEP_KEYS.indexOf(stepItem.key);
                const isActive = stepIdx <= currentStepIdx;
                const isCurrent = stepItem.key === currentStep;

                return (
                    <div key={stepItem.key} className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-sm ${isActive
                                    ? "bg-cyan-400 border-cyan-400 text-gray-900"
                                    : "bg-gray-700 border-gray-600 text-gray-400"
                                } ${isCurrent ? "ring-4 ring-cyan-400/50" : ""}`}
                        >
                            {isActive && !isCurrent ? (
                                <IoCheckmarkCircle className="text-xl" />
                            ) : (
                                <span className="font-bold">{idx + 1}</span>
                            )}
                        </div>
                        <span
                            className={`ml-2 text-xs font-medium ${isActive ? "text-cyan-400" : "text-gray-500"
                                }`}
                        >
                            {stepItem.label}
                        </span>
                        {idx < STEPS.length - 1 && (
                            <div
                                className={`w-12 h-0.5 mx-3 ${isActive ? "bg-cyan-400" : "bg-gray-600"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

