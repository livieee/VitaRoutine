import { Clock } from "lucide-react";
import { SupplementRoutineItem } from "@/lib/types";

type RoutineDisplayProps = {
  supplementRoutine: SupplementRoutineItem[];
};

export default function RoutineDisplay({ supplementRoutine }: RoutineDisplayProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8">
      <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
        <h4 className="font-medium text-primary-800">Daily Supplement Schedule</h4>
      </div>
      
      <div className="p-4">
        {supplementRoutine.length === 0 ? (
          <p className="text-neutral-600 text-center py-4">
            No supplement routine available.
          </p>
        ) : (
          supplementRoutine.map((item, index) => (
            <div className="mb-6 last:mb-0" key={index}>
              <div className="flex items-start mb-2">
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
                  <h5 className="font-medium">{item.supplement}</h5>
                  <p className="text-sm text-neutral-600">{item.instructions}</p>
                </div>
              </div>
              <div className="ml-12 text-sm text-neutral-700">
                <p className="mb-2">{item.reasoning}</p>
                <div className="flex items-center text-neutral-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
