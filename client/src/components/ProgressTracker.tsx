type ProgressTrackerProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  const stepLabels = ["Health Goals", "Lifestyle", "Your Routine"];
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-700">
            {stepLabels[currentStep - 1]}
          </span>
          <span className="text-sm font-medium text-primary-700">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <div className="w-full bg-primary-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
