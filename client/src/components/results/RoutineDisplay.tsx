import { Clock, Star, ScrollText, Pill, CircleDot } from "lucide-react";
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center text-primary-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{item.time}</span>
                      </div>
                      
                      {item.brand && (
                        <div className="flex items-center text-amber-600">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Recommended: {item.brand}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Pill className={`h-8 w-8 ${
                  item.timeOfDay === "Morning"
                    ? "text-primary-500"
                    : item.timeOfDay === "Midday"
                    ? "text-secondary-500"
                    : "text-neutral-500"
                }`} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="bg-white p-4 rounded-md border border-primary-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <ScrollText className="h-4 w-4 mr-2 text-primary-500" />
                    <h6 className="font-medium text-primary-700">Instructions</h6>
                  </div>
                  <p className="text-sm text-neutral-700">{item.instructions}</p>
                </div>
                
                <div className="bg-white p-4 rounded-md border border-secondary-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 mr-2 text-secondary-500" />
                    <h6 className="font-medium text-secondary-700">Benefits</h6>
                  </div>
                  
                  {/* Check if reasoning has bullet points (indicated by "-" or "•") */}
                  {item.reasoning.includes("- ") || item.reasoning.includes("• ") ? (
                    <ul className="text-sm text-neutral-700 space-y-1 list-disc pl-4">
                      {item.reasoning.split(/\n/).map((point, i) => {
                        const cleanPoint = point.replace(/^[-•]\s+/, "").trim();
                        return cleanPoint ? (
                          <li key={i} className="text-sm">{cleanPoint}</li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-700">{item.reasoning}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
