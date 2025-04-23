import { useState } from "react";
import { 
  Clock, Star, ScrollText, Pill, ChevronDown, ChevronUp, 
  Utensils, RefreshCw, X, MessageSquareText 
} from "lucide-react";
import { SupplementRoutineItem } from "@/lib/types";

type RoutineDisplayProps = {
  supplementRoutine: SupplementRoutineItem[];
};

export default function RoutineDisplay({ supplementRoutine }: RoutineDisplayProps) {
  // State to track which supplement cards are expanded
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  // Toggle card expansion
  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get time of day color
  const getTimeOfDayColor = (timeOfDay: string) => {
    return timeOfDay === "Morning"
      ? "primary"
      : timeOfDay === "Midday"
      ? "secondary"
      : "neutral";
  };

  // Function to extract a quick instruction from the full instructions
  const getQuickInstruction = (instructions: string): string => {
    // Try to find patterns like "Take with..." or "Take on..."
    const takeWithMatch = instructions.match(/take with ([^.]+)/i);
    const takeOnMatch = instructions.match(/take on ([^.]+)/i);
    const takeBeforeMatch = instructions.match(/take before ([^.]+)/i);
    const takeAfterMatch = instructions.match(/take after ([^.]+)/i);
    
    if (takeWithMatch) return `Take with ${takeWithMatch[1]}`;
    if (takeOnMatch) return `Take on ${takeOnMatch[1]}`;
    if (takeBeforeMatch) return `Take before ${takeBeforeMatch[1]}`;
    if (takeAfterMatch) return `Take after ${takeAfterMatch[1]}`;
    
    // If no match, take first sentence or truncate
    const firstSentence = instructions.split('.')[0];
    return firstSentence.length > 40 ? `${firstSentence.substring(0, 37)}...` : firstSentence;
  };
  
  // Format the food pairing from instructions if available
  const getFoodPairing = (instructions: string): string | null => {
    const foodPairingMatch = instructions.match(/(?:take|pair|consume) with ([^.]+)/i);
    return foodPairingMatch ? foodPairingMatch[1].trim() : null;
  };

  const sortedSupplements = supplementRoutine
    .slice()
    .sort((a, b) => {
      const timeOrder = {"Morning": 1, "Midday": 2, "Evening": 3};
      return timeOrder[a.timeOfDay as keyof typeof timeOrder] - timeOrder[b.timeOfDay as keyof typeof timeOrder];
    });

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
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <h5 className="text-primary-800 font-medium mb-3">Your Personalized Supplement Routine</h5>
              <p className="text-neutral-700 mb-3">Based on your goals and lifestyle, here's a scientifically backed supplement and nutrition plan. Click on any supplement to see more details.</p>
            </div>

            {/* Timeline View */}
            <div className="space-y-3">
              {sortedSupplements.map((item, index) => {
                const colorTheme = getTimeOfDayColor(item.timeOfDay);
                const isExpanded = expandedCards[index] || false;
                const quickInstruction = getQuickInstruction(item.instructions);
                const foodPairing = getFoodPairing(item.instructions);
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded-lg transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? colorTheme === "primary" 
                          ? "border-primary-300 shadow-md" 
                          : colorTheme === "secondary" 
                            ? "border-secondary-300 shadow-md" 
                            : "border-neutral-300 shadow-md"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {/* Card Header - Always visible */}
                    <div 
                      className={`p-4 ${
                        isExpanded 
                          ? colorTheme === "primary" 
                            ? "bg-primary-50" 
                            : colorTheme === "secondary" 
                              ? "bg-secondary-50" 
                              : "bg-neutral-50"
                          : "bg-white"
                      } cursor-pointer`}
                      onClick={() => toggleCardExpansion(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          {/* Time & Dot Indicator */}
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              colorTheme === "primary" 
                                ? "bg-primary-500" 
                                : colorTheme === "secondary" 
                                  ? "bg-secondary-500" 
                                  : "bg-neutral-500"
                            } mb-1`}></div>
                            <span className={`text-xs font-medium ${
                              colorTheme === "primary" 
                                ? "text-primary-700" 
                                : colorTheme === "secondary" 
                                  ? "text-secondary-700" 
                                  : "text-neutral-700"
                            }`}>{item.time}</span>
                            <span className="text-xs text-neutral-500">{item.timeOfDay}</span>
                          </div>
                          
                          {/* Supplement Info */}
                          <div>
                            <h5 className={`font-medium text-lg ${
                              colorTheme === "primary" 
                                ? "text-primary-800" 
                                : colorTheme === "secondary" 
                                  ? "text-secondary-800" 
                                  : "text-neutral-800"
                            }`}>{item.supplement}</h5>
                            <p className="text-sm text-neutral-600 mt-1">{quickInstruction}</p>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Icon */}
                        <div className="flex items-center">
                          <Pill className={`h-5 w-5 mr-2 ${
                            colorTheme === "primary" 
                              ? "text-primary-500" 
                              : colorTheme === "secondary" 
                                ? "text-secondary-500" 
                                : "text-neutral-500"
                          }`} />
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-neutral-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-neutral-100 bg-white">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* Brand Recommendation */}
                            {item.brand && (
                              <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                                <div className="flex items-center mb-2">
                                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                                  <h6 className="font-medium text-amber-800">Recommended Brand</h6>
                                </div>
                                <p className="text-sm text-amber-800">{item.brand}</p>
                              </div>
                            )}
                            
                            {/* Instructions */}
                            <div className={`p-3 rounded-md border ${
                              colorTheme === "primary" 
                                ? "bg-primary-50 border-primary-100" 
                                : colorTheme === "secondary" 
                                  ? "bg-secondary-50 border-secondary-100" 
                                  : "bg-neutral-50 border-neutral-100"
                            }`}>
                              <div className="flex items-center mb-2">
                                <ScrollText className={`h-4 w-4 mr-2 ${
                                  colorTheme === "primary" 
                                    ? "text-primary-500" 
                                    : colorTheme === "secondary" 
                                      ? "text-secondary-500" 
                                      : "text-neutral-500"
                                }`} />
                                <h6 className={`font-medium ${
                                  colorTheme === "primary" 
                                    ? "text-primary-800" 
                                    : colorTheme === "secondary" 
                                      ? "text-secondary-800" 
                                      : "text-neutral-800"
                                }`}>Instructions</h6>
                              </div>
                              <p className="text-sm text-neutral-700">{item.instructions}</p>
                            </div>
                            
                            {/* Food Pairing */}
                            {foodPairing && (
                              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                <div className="flex items-center mb-2">
                                  <Utensils className="h-4 w-4 mr-2 text-green-500" />
                                  <h6 className="font-medium text-green-800">Food Pairing</h6>
                                </div>
                                <p className="text-sm text-green-800">{foodPairing}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Right Column - Benefits */}
                          <div className="bg-white p-3 rounded-md border border-neutral-200">
                            <div className="flex items-center mb-2">
                              <Star className={`h-4 w-4 mr-2 ${
                                colorTheme === "primary" 
                                  ? "text-primary-500" 
                                  : colorTheme === "secondary" 
                                    ? "text-secondary-500" 
                                    : "text-neutral-500"
                              }`} />
                              <h6 className={`font-medium ${
                                colorTheme === "primary" 
                                  ? "text-primary-800" 
                                  : colorTheme === "secondary" 
                                    ? "text-secondary-800" 
                                    : "text-neutral-800"
                              }`}>Benefits & Scientific Reasoning</h6>
                            </div>
                            
                            {/* Check if reasoning has bullet points */}
                            {item.reasoning.includes("- ") || item.reasoning.includes("• ") ? (
                              <ul className="text-sm text-neutral-700 space-y-1 list-disc pl-4">
                                {item.reasoning.split(/\n/).map((point: string, i: number) => {
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
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4 border-t border-neutral-100 pt-4">
                          {/* Swap Button */}
                          <button 
                            className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm transition-all duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Swap feature for "${item.supplement}" coming soon!`);
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            <span>Swap</span>
                          </button>
                          
                          {/* Remove Button */}
                          <button 
                            className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm transition-all duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Remove feature for "${item.supplement}" coming soon!`);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            <span>Remove</span>
                          </button>
                          
                          {/* Ask AI Button */}
                          <button 
                            className="flex items-center px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-md text-sm transition-all duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`AI consultation for "${item.supplement}" coming soon!`);
                            }}
                          >
                            <MessageSquareText className="h-4 w-4 mr-2" />
                            <span>Ask AI</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
