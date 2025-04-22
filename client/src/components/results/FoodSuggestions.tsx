import { FoodSuggestion } from "@/lib/types";
import { UtensilsCrossed, Coffee, Soup, Cookie } from "lucide-react";

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
              <ul className="space-y-2 pl-2">
                {foodSuggestions.breakfast.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mr-2 rounded-full bg-secondary-100 flex-shrink-0 mt-1"></span>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {foodSuggestions.lunch && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Soup className="mr-2 h-4 w-4 text-secondary-500" />
                Lunch & Dinner Options
              </h5>
              <ul className="space-y-2 pl-2">
                {foodSuggestions.lunch.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mr-2 rounded-full bg-secondary-100 flex-shrink-0 mt-1"></span>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {foodSuggestions.snacks && (
            <div className="border border-neutral-100 rounded-lg p-4 hover:border-secondary-200 transition-all duration-200 interactive-card">
              <h5 className="font-medium mb-3 flex items-center text-secondary-700">
                <Cookie className="mr-2 h-4 w-4 text-secondary-500" />
                Snack Options
              </h5>
              <ul className="space-y-2 pl-2">
                {foodSuggestions.snacks.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mr-2 rounded-full bg-secondary-100 flex-shrink-0 mt-1"></span>
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
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
