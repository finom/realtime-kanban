import { createAIComponentRenderer } from "../../../createAIComponentRenderer";
import { Check } from "lucide-react";
import { StepperDef } from "./def";

export const StepperRenderer = createAIComponentRenderer({
  def: StepperDef,
  renderer: ({
    steps = [],
    currentStep = 0,
    orientation = "horizontal",
    onStepClick,
    generatedId,
  }) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <div
        className={`flex ${isHorizontal ? "flex-row items-start" : "flex-col"} gap-0`}
        data-id={generatedId}
      >
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div
              key={i}
              className={`flex ${isHorizontal ? "flex-col items-center flex-1" : "flex-row items-start"} ${isHorizontal ? "" : "pb-8 last:pb-0"}`}
            >
              <div
                className={`flex ${isHorizontal ? "flex-row w-full items-center" : "flex-col items-center mr-4"}`}
              >
                {/* Connector before */}
                {i > 0 && isHorizontal && (
                  <div
                    className={`flex-1 h-0.5 ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                )}
                {i > 0 && !isHorizontal && (
                  <div
                    className={`w-0.5 flex-1 min-h-4 ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                )}

                {/* Step circle */}
                <button
                  type="button"
                  className={`shrink-0 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isCompleted
                      ? "size-8 bg-primary text-primary-foreground"
                      : isCurrent
                        ? "size-8 border-2 border-primary text-primary"
                        : "size-8 border-2 border-border text-muted-foreground"
                  }`}
                  onClick={() => onStepClick?.({ step: i })}
                >
                  {isCompleted ? <Check className="size-4" /> : i + 1}
                </button>

                {/* Connector after */}
                {!isLast && isHorizontal && (
                  <div
                    className={`flex-1 h-0.5 ${i < currentStep - 1 || isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>

              {/* Label */}
              <div
                className={`${isHorizontal ? "text-center mt-2 px-1" : "pt-1"}`}
              >
                <p
                  className={`text-sm font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
