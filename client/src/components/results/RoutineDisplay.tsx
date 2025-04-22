import { Clock } from "lucide-react";
import { SupplementRoutineItem } from "@/lib/types";

type RoutineDisplayProps = {
  supplementRoutine: SupplementRoutineItem[];
};

export default function RoutineDisplay({ supplementRoutine }: RoutineDisplayProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8 shadow-md transition-all duration-300 hover:shadow-lg content-section entered">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-3 border-b border-primary-100">
        <h4 className="font-medium text-primary-800 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary-500" />
          Daily Supplement Schedule
        </h4>
      </div>
      
      <div className="p-4">
        {supplementRoutine.length === 0 ? (
          <p className="text-neutral-600 text-center py-4">
            No supplement routine available.
          </p>
        ) : (
          supplementRoutine.map((item, index) => (
            <div className="mb-8 last:mb-0 border border-neutral-100 rounded-lg p-4 hover:border-primary-200 transition-all duration-200 interactive-card" key={index}>
              <div className="flex items-start mb-3">
                <div 
                  className={`text-sm font-medium rounded-full px-3 py-1 mr-3 ${
                    item.timeOfDay === "Morning"
                      ? "bg-primary-100 text-primary-800"
                      : item.timeOfDay === "Midday"
                      ? "bg-secondary-100 text-secondary-800"
                      : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {item.timeOfDay}
                </div>
                <div>
                  <h5 className="font-medium text-lg">{item.supplement}</h5>
                  <div className="flex items-center text-primary-500 mt-1 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-0 bg-neutral-50 p-3 rounded-md border border-neutral-100">
                <p className="text-sm mb-3 font-medium">Instructions:</p>
                <p className="text-sm text-neutral-700 mb-3 pl-3 border-l-2 border-primary-200">{item.instructions}</p>
                
                <p className="text-sm mb-2 font-medium">Scientific Reasoning:</p>
                <p className="text-sm text-neutral-700 pl-3 border-l-2 border-secondary-200">{item.reasoning}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
