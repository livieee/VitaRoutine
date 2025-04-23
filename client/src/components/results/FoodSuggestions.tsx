import { FoodSuggestion } from "@/lib/types";
import { UtensilsCrossed, Coffee, Soup, Cookie, Utensils, CheckCircle2 } from "lucide-react";

// Use CheckCircle2 as a replacement for CircleDot since CircleDot is not available in the current lucide-react version
const CircleDot = CheckCircle2;

type FoodSuggestionsProps = {
  foodSuggestions: FoodSuggestion;
};

export default function FoodSuggestions({ foodSuggestions }: FoodSuggestionsProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8 shadow-md transition-all duration-300 hover:shadow-lg content-section entered">
      <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 px-4 py-3 border-b border-secondary-100">
        <h4 className="font-medium text-secondary-800 flex items-center">
          <UtensilsCrossed className="mr-2 h-5 w-5 text-secondary-500" />
          Personalized Food Suggestions
        </h4>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <p className="text-neutral-700">
            Based on your profile, include these nutrient-dense foods in your diet:
          </p>
          
          {foodSuggestions.breakfast && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Coffee className="mr-2 h-4 w-4 text-secondary-500" />
                Breakfast Options
              </h5>
              <ul className="space-y-3 pl-2">
                {foodSuggestions.breakfast.map((item, index) => {
                  // Parse food item to highlight nutrients or benefits if they exist in parentheses
                  const matches = item.match(/(.*?)(\(.*?\))(.*)/);
                  
                  if (matches) {
                    return (
                      <li key={index} className="flex items-start">
                        <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-neutral-800 font-medium">{matches[1].trim()} </span>
                          <span className="text-secondary-600 font-medium">{matches[2]}</span>
                          <span className="text-neutral-700">{matches[3]}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={index} className="flex items-start">
                      <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {foodSuggestions.lunch && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Soup className="mr-2 h-4 w-4 text-secondary-500" />
                Lunch Options
              </h5>
              <ul className="space-y-3 pl-2">
                {foodSuggestions.lunch.map((item, index) => {
                  // Parse food item to highlight nutrients or benefits if they exist in parentheses
                  const matches = item.match(/(.*?)(\(.*?\))(.*)/);
                  
                  if (matches) {
                    return (
                      <li key={index} className="flex items-start">
                        <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-neutral-800 font-medium">{matches[1].trim()} </span>
                          <span className="text-secondary-600 font-medium">{matches[2]}</span>
                          <span className="text-neutral-700">{matches[3]}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={index} className="flex items-start">
                      <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {foodSuggestions.dinner && foodSuggestions.dinner.length > 0 && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Utensils className="mr-2 h-4 w-4 text-secondary-500" />
                Dinner Options
              </h5>
              <ul className="space-y-3 pl-2">
                {foodSuggestions.dinner.map((item, index) => {
                  // Parse food item to highlight nutrients or benefits if they exist in parentheses
                  const matches = item.match(/(.*?)(\(.*?\))(.*)/);
                  
                  if (matches) {
                    return (
                      <li key={index} className="flex items-start">
                        <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-neutral-800 font-medium">{matches[1].trim()} </span>
                          <span className="text-secondary-600 font-medium">{matches[2]}</span>
                          <span className="text-neutral-700">{matches[3]}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={index} className="flex items-start">
                      <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {foodSuggestions.snacks && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Cookie className="mr-2 h-4 w-4 text-secondary-500" />
                Snack Options
              </h5>
              <ul className="space-y-3 pl-2">
                {foodSuggestions.snacks.map((item, index) => {
                  // Parse food item to highlight nutrients or benefits if they exist in parentheses
                  const matches = item.match(/(.*?)(\(.*?\))(.*)/);
                  
                  if (matches) {
                    return (
                      <li key={index} className="flex items-start">
                        <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-neutral-800 font-medium">{matches[1].trim()} </span>
                          <span className="text-secondary-600 font-medium">{matches[2]}</span>
                          <span className="text-neutral-700">{matches[3]}</span>
                        </div>
                      </li>
                    );
                  }
                  
                  return (
                    <li key={index} className="flex items-start">
                      <CircleDot className="h-4 w-4 mr-2 text-secondary-400 flex-shrink-0 mt-1" />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {(!foodSuggestions.breakfast && !foodSuggestions.lunch && !foodSuggestions.snacks) && (
            <p className="text-neutral-600 text-center py-4">
              No food suggestions available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
