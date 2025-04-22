type ProgressTrackerProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  const stepLabels = ["Health Goals", "Lifestyle", "Your Routine"];
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-6 border-b border-primary-200 shadow-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2 shadow-sm">
              {currentStep}
            </div>
            <span className="text-base font-semibold text-primary-800">
              {stepLabels[currentStep - 1]}
            </span>
          </div>
          <span className="text-sm font-medium text-primary-700 bg-white px-3 py-1 rounded-full border border-primary-200">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center justify-between mb-3 px-2">
          {stepLabels.map((label, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
            >
              <div 
                className={`rounded-full w-4 h-4 mb-1 flex-shrink-0 ${
                  index + 1 === currentStep 
                    ? "bg-primary-600 ring-4 ring-primary-200" 
                    : index + 1 < currentStep 
                      ? "bg-primary-600" 
                      : "bg-primary-200"
                }`}
              />
              <span className={`text-xs ${
                index + 1 === currentStep 
                  ? "font-medium text-primary-800" 
                  : "text-primary-600"
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-3 shadow-inner relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 to-primary-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
