import { FoodSuggestion } from "@/lib/types";

type FoodSuggestionsProps = {
  foodSuggestions: FoodSuggestion;
};

export default function FoodSuggestions({ foodSuggestions }: FoodSuggestionsProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8">
      <div className="bg-secondary-50 px-4 py-3 border-b border-secondary-100">
        <h4 className="font-medium text-secondary-800">Personalized Food Suggestions</h4>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <p className="text-neutral-700">
            Based on your profile, include these nutrient-dense foods in your diet:
          </p>
          
          {foodSuggestions.breakfast && (
            <div>
              <h5 className="font-medium mb-2">Breakfast Options</h5>
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                {foodSuggestions.breakfast.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {foodSuggestions.lunch && (
            <div>
              <h5 className="font-medium mb-2">Lunch & Dinner Options</h5>
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                {foodSuggestions.lunch.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {foodSuggestions.snacks && (
            <div>
              <h5 className="font-medium mb-2">Snack Options</h5>
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                {foodSuggestions.snacks.map((item, index) => (
                  <li key={index}>{item}</li>
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
