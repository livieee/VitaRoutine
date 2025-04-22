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
        <div className="w-full bg-white rounded-full h-4 shadow-inner relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 h-full rounded-full transition-all duration-1000 ease-in-out transform-gpu shadow-sm gradient-animate"
            style={{ width: `${percentage}%` }}
          >
            {currentStep === 2 && (
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            )}
            
            {/* Special highlight effect when transitioning to step 2 */}
            {currentStep === 2 && (
              <div className="step-transition-highlight"></div>
            )}
          </div>
          
          {/* Subtle progress markers */}
          <div className="absolute inset-y-0 left-1/3 w-px h-full bg-white opacity-50"></div>
          <div className="absolute inset-y-0 left-2/3 w-px h-full bg-white opacity-50"></div>
          
          {/* Progress labels under the bar */}
          <div className="absolute top-full mt-1 left-1/3 transform -translate-x-1/2">
            <div className={`h-1 w-1 rounded-full ${currentStep >= 2 ? 'bg-primary-600' : 'bg-primary-200'} mx-auto mb-1`}></div>
            <span className="text-[10px] text-primary-700">Step 2</span>
          </div>
          <div className="absolute top-full mt-1 left-2/3 transform -translate-x-1/2">
            <div className={`h-1 w-1 rounded-full ${currentStep >= 3 ? 'bg-primary-600' : 'bg-primary-200'} mx-auto mb-1`}></div>
            <span className="text-[10px] text-primary-700">Step 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
