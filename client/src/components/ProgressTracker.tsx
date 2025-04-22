type ProgressTrackerProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  const stepLabels = ["Health Goals", "Lifestyle", "Your Routine"];
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white px-6 py-4 border-b border-neutral-200 shadow-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-primary-600 text-white font-medium px-3 py-1 rounded-md mr-2">
              Step {currentStep} of {totalSteps}
            </div>
            <span className="text-lg font-medium text-primary-800">
              {stepLabels[currentStep - 1]}
            </span>
          </div>
        </div>
        
        {/* Simple progress bar */}
        <div className="w-full bg-neutral-100 rounded-full h-6 p-1">
          <div 
            className="h-full bg-primary-600 rounded-full text-xs text-white font-semibold flex items-center justify-center transition-all duration-300"
            style={{ width: `${percentage}%` }}
          >
            {Math.round(percentage)}%
          </div>
        </div>
        
        {/* Step labels */}
        <div className="flex justify-between mt-2 px-1">
          {stepLabels.map((label, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;
            
            return (
              <div 
                key={index} 
                className={`text-xs font-medium ${
                  isCompleted ? 'text-primary-600' : 
                  isCurrent ? 'text-primary-800' : 'text-neutral-400'
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
