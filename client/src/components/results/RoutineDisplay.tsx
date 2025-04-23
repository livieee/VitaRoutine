import { useState, useEffect } from "react";
import { 
  Clock, Star, ScrollText, Pill, ChevronDown, ChevronUp, 
  Utensils, RefreshCw, X, MessageSquareText, ShoppingBag,
  HeartPulse, Award, CircleCheck, Save, Check, Sun, 
  Coffee, Sunset, Moon, HelpCircle, Info, 
  AlertCircle, Bot
} from "lucide-react";
import { SupplementRoutineItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import AskAIModal from "./AskAIModal";
import SwapModal from "./SwapModal";

type RoutineDisplayProps = {
  supplementRoutine: SupplementRoutineItem[];
  healthGoals?: string[]; // Health goals for context in Ask AI
};

export default function RoutineDisplay({ supplementRoutine, healthGoals = ["general health"] }: RoutineDisplayProps) {
  // Get toast hook for notifications
  const { toast } = useToast();
  
  // State to track which supplement cards are expanded
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  // State to track if the routine is already saved
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // State to track removed supplements
  const [removedItems, setRemovedItems] = useState<Record<string, boolean>>({});
  
  // State to track the current routine with removed items filtered out
  const [currentRoutine, setCurrentRoutine] = useState<SupplementRoutineItem[]>(supplementRoutine);
  
  // State for Ask AI modal
  const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<SupplementRoutineItem | null>(null);
  
  // State for Swap modal
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  
  // Update currentRoutine when removedItems changes
  useEffect(() => {
    const updatedRoutine = supplementRoutine.filter((_, index) => !removedItems[index.toString()]);
    setCurrentRoutine(updatedRoutine);
  }, [removedItems, supplementRoutine]);

  // Check if routine exists in localStorage on component mount
  useEffect(() => {
    const savedRoutine = localStorage.getItem("vitaroutine.com:routine");
    if (savedRoutine) {
      try {
        const parsedRoutine = JSON.parse(savedRoutine);
        // A simple check to see if what's saved matches the current routine
        if (parsedRoutine && 
            Array.isArray(parsedRoutine) && 
            parsedRoutine.length === supplementRoutine.length) {
          setIsSaved(true);
          
          // Also check for any previously removed items
          const savedRemovedItems = localStorage.getItem("vitaroutine.com:removedItems");
          if (savedRemovedItems) {
            try {
              const parsedRemovedItems = JSON.parse(savedRemovedItems);
              if (parsedRemovedItems && typeof parsedRemovedItems === 'object') {
                setRemovedItems(parsedRemovedItems);
              }
            } catch (e) {
              console.error("Error parsing removed items:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing saved routine:", error);
      }
    }
  }, [supplementRoutine]);
  
  // Function to save routine to localStorage
  const saveRoutine = () => {
    try {
      // Save the current routine (with removed items filtered out)
      localStorage.setItem("vitaroutine.com:routine", JSON.stringify(currentRoutine));
      
      // Save the record of removed items
      localStorage.setItem("vitaroutine.com:removedItems", JSON.stringify(removedItems));
      
      setIsSaved(true);
      toast({
        title: "Success!",
        description: "Your supplement routine has been saved.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving routine:", error);
      toast({
        title: "Error",
        description: "Could not save your routine. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Function to remove an item from the routine
  const removeItem = (supplementIndex: number) => {
    setRemovedItems(prev => ({
      ...prev,
      [supplementIndex.toString()]: true
    }));
    
    // If the routine was saved, mark it as unsaved since we've modified it
    if (isSaved) {
      setIsSaved(false);
    }
    
    toast({
      title: "Supplement Removed",
      description: "This supplement has been removed from your routine. You can re-add it by regenerating your routine.",
      duration: 3000,
    });
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId: string | number) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId.toString()]: !prev[cardId.toString()]
    }));
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

  // Filter out removed supplements
  const filteredSupplements = supplementRoutine
    .filter((_, index) => !removedItems[index.toString()]);
  
  const sortedSupplements = filteredSupplements
    .slice()
    .sort((a, b) => {
      const timeOrder = {"Morning": 1, "Midday": 2, "Evening": 3, "Night": 4};
      return timeOrder[a.timeOfDay as keyof typeof timeOrder] - timeOrder[b.timeOfDay as keyof typeof timeOrder];
    });
    
  // Group supplements by time of day
  const groupedSupplements = sortedSupplements.reduce((acc, item) => {
    if (!acc[item.timeOfDay]) {
      acc[item.timeOfDay] = [];
    }
    acc[item.timeOfDay].push(item);
    return acc;
  }, {} as Record<string, SupplementRoutineItem[]>);

  // Get time of day icon
  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch(timeOfDay) {
      case "Morning":
        return <Sun className="h-5 w-5 text-amber-600" />;
      case "Midday":
        return <Coffee className="h-5 w-5 text-blue-600" />;
      case "Evening":
        return <Sunset className="h-5 w-5 text-purple-600" />;
      case "Night":
        return <Moon className="h-5 w-5 text-indigo-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Extract dosage from supplement name if available
  const getDosage = (supplement: string): string | null => {
    const dosageMatch = supplement.match(/\(([^)]+)\)/);
    return dosageMatch ? dosageMatch[1] : null;
  };

  // Clean supplement name by removing dosage
  const getCleanName = (supplement: string): string => {
    return supplement.replace(/\s*\([^)]*\)/, '').trim();
  };
  
  // Function to handle successful supplement swap
  const handleSwapSuccess = (originalItem: SupplementRoutineItem, newItem: SupplementRoutineItem) => {
    // Create a copy of the supplement routine
    const updatedRoutine = [...supplementRoutine];
    
    // Find the index of the original item
    const itemIndex = updatedRoutine.findIndex(
      item => item.supplement === originalItem.supplement && 
              item.timeOfDay === originalItem.timeOfDay
    );
    
    // If the item was found, replace it with the new item
    if (itemIndex !== -1) {
      updatedRoutine[itemIndex] = newItem;
      
      // Update the supplementRoutine state
      // Note: We're using a workaround here since supplementRoutine is a prop
      // In a real application, this would be managed by the parent component
      // or a state management solution
      
      // We update currentRoutine which we do have direct control over
      const filteredUpdatedRoutine = updatedRoutine.filter(
        (_, index) => !removedItems[index.toString()]
      );
      setCurrentRoutine(filteredUpdatedRoutine);
      
      // Mark as unsaved since we've modified the routine
      setIsSaved(false);
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8 shadow-md transition-all duration-300 hover:shadow-lg content-section entered">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-3 border-b border-primary-100">
        <h4 className="font-medium text-primary-800 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary-500" />
          Your Daily Supplement Plan
        </h4>
      </div>
      
      <div className="p-4">
        {supplementRoutine.length === 0 ? (
          <p className="text-neutral-600 text-center py-4">
            No supplement routine available.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <div className="flex flex-wrap items-center justify-between mb-3">
                <h5 className="text-primary-800 font-medium">Your Personalized Supplement Routine</h5>
                
                {/* Save Routine Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveRoutine();
                  }}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    isSaved
                      ? "bg-green-100 text-green-700"
                      : "bg-primary-100 hover:bg-primary-200 text-primary-700"
                  }`}
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span>💾 Save My Routine</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-neutral-700 mb-3">Here's your science-backed supplement plan tailored to your needs. Click on any supplement for details!</p>
              
              {/* Removed Items Notification */}
              {Object.keys(removedItems).length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mt-2 mb-2">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-700">
                        <span className="font-medium">Note:</span> You've removed {Object.keys(removedItems).length} supplement{Object.keys(removedItems).length !== 1 ? 's' : ''} from your routine.
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Removed supplements won't appear in your saved routine.
                      </p>
                    </div>
                  </div>
                  
                  {/* List of removed supplements */}
                  <div className="mt-3 mb-2 space-y-2">
                    <p className="text-xs font-medium text-red-700">Removed supplements:</p>
                    
                    <div className="bg-white rounded border border-red-100 divide-y divide-red-50">
                      {Object.keys(removedItems).map(indexStr => {
                        const index = parseInt(indexStr);
                        if (isNaN(index) || !supplementRoutine[index]) return null;
                        
                        const item = supplementRoutine[index];
                        const cleanName = getCleanName(item.supplement);
                        const dosage = getDosage(item.supplement);
                        
                        return (
                          <div key={`removed-${index}`} className="px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <Pill className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-xs text-neutral-700">{cleanName}</span>
                              {dosage && (
                                <span className="ml-1 text-xs text-neutral-500">({dosage})</span>
                              )}
                              <span className="ml-2 text-xs text-neutral-500">{item.timeOfDay}</span>
                            </div>
                            <button
                              onClick={() => {
                                // Remove the item from the removedItems state
                                const updatedRemovedItems = {...removedItems};
                                delete updatedRemovedItems[index];
                                setRemovedItems(updatedRemovedItems);
                                
                                // Update localStorage if needed
                                if (Object.keys(updatedRemovedItems).length > 0) {
                                  localStorage.setItem("vitaroutine.com:removedItems", JSON.stringify(updatedRemovedItems));
                                } else {
                                  localStorage.removeItem("vitaroutine.com:removedItems");
                                }
                                
                                setIsSaved(false);
                                toast({
                                  title: "Supplement Restored",
                                  description: `${cleanName} has been restored to your routine.`,
                                  duration: 3000,
                                });
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Restore
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        // Clear removed items
                        setRemovedItems({});
                        // Clear from localStorage if it exists
                        localStorage.removeItem("vitaroutine.com:removedItems");
                        setIsSaved(false);
                        toast({
                          title: "All Supplements Restored",
                          description: "All supplements have been restored to your routine.",
                          duration: 3000,
                        });
                      }}
                      className="flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md text-xs font-medium transition-all duration-150"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Restore All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Time-of-Day Grouping */}
            <div className="space-y-6">
              {Object.keys(groupedSupplements).map((timeOfDay) => {
                const timeItems = groupedSupplements[timeOfDay];
                const firstItem = timeItems[0];
                let bgColor, textColor, borderColor, lightBgColor;
                
                switch(timeOfDay) {
                  case "Morning":
                    bgColor = "bg-amber-500";
                    textColor = "text-amber-800";
                    borderColor = "border-amber-200";
                    lightBgColor = "bg-amber-50";
                    break;
                  case "Midday":
                    bgColor = "bg-blue-500";
                    textColor = "text-blue-800";
                    borderColor = "border-blue-200";
                    lightBgColor = "bg-blue-50";
                    break;
                  case "Evening":
                    bgColor = "bg-purple-500";
                    textColor = "text-purple-800";
                    borderColor = "border-purple-200";
                    lightBgColor = "bg-purple-50";
                    break;
                  case "Night":
                    bgColor = "bg-indigo-500";
                    textColor = "text-indigo-800";
                    borderColor = "border-indigo-200";
                    lightBgColor = "bg-indigo-50";
                    break;
                  default:
                    bgColor = "bg-gray-500";
                    textColor = "text-gray-800";
                    borderColor = "border-gray-200";
                    lightBgColor = "bg-gray-50";
                }
                
                return (
                  <div key={timeOfDay} className={`border rounded-lg overflow-hidden shadow-sm ${borderColor}`}>
                    {/* Time of Day Header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${lightBgColor}`}>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${bgColor} bg-opacity-20`}>
                          {getTimeOfDayIcon(timeOfDay)}
                        </div>
                        <div>
                          <h3 className={`font-medium text-lg ${textColor}`}>
                            {timeOfDay === "Morning" ? "☀️ Morning" : 
                             timeOfDay === "Midday" ? "🍽️ Midday" : 
                             timeOfDay === "Evening" ? "🌙 Evening" : 
                             timeOfDay === "Night" ? "💤 Night" : timeOfDay}
                          </h3>
                          <p className="text-neutral-500 text-sm">{firstItem.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Supplements for this time of day */}
                    <div className="divide-y divide-neutral-100">
                      {timeItems.map((item, index) => {
                        const cardId = `${timeOfDay}-${index}`;
                        const isExpanded = expandedCards[cardId] || false;
                        const quickInstruction = getQuickInstruction(item.instructions);
                        const foodPairing = getFoodPairing(item.instructions);
                        const dosage = getDosage(item.supplement);
                        const cleanName = getCleanName(item.supplement);
                        
                        return (
                          <div key={cardId} className="group">
                            {/* Supplement Card - Compact View */}
                            <div 
                              className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-200`}
                              onClick={() => toggleCardExpansion(cardId)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <div className="mr-3 mt-1">
                                    <Pill className={`h-5 w-5 ${textColor}`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center flex-wrap">
                                      <h4 className="font-medium text-neutral-800 mr-2">💊 {cleanName}</h4>
                                      {dosage && (
                                        <span className="mr-2 mb-1 text-xs px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-600">
                                          {dosage}
                                        </span>
                                      )}
                                      
                                      {/* Quick Action Icons - visible on hover */}
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                                        <button 
                                          className="p-1 rounded-full hover:bg-blue-100 text-blue-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSupplement(item);
                                            setIsSwapModalOpen(true);
                                          }}
                                          title="Swap supplement"
                                        >
                                          <RefreshCw className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                          className="p-1 rounded-full hover:bg-red-100 text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Find the correct index in the original supplementRoutine array
                                            const supplementIndex = supplementRoutine.findIndex(
                                              s => s.supplement === item.supplement && s.timeOfDay === item.timeOfDay
                                            );
                                            if (supplementIndex !== -1) {
                                              removeItem(supplementIndex);
                                            }
                                          }}
                                          title="Remove supplement"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-neutral-600 mt-1 flex items-center">
                                      <span className="text-green-600 mr-1">✓</span> {quickInstruction}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                                <div className="grid md:grid-cols-2 gap-4">
                                  {/* Left Column - Brand & Usage */}
                                  <div className="space-y-4">
                                    {/* Brand Recommendation */}
                                    {item.brand && (
                                      <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                                        <div className="flex items-center mb-2">
                                          <ShoppingBag className="h-4 w-4 mr-2 text-amber-500" />
                                          <h6 className="font-medium text-amber-800">Suggested Brand</h6>
                                        </div>
                                        <p className="text-sm text-amber-800">{item.brand}</p>
                                      </div>
                                    )}
                                    
                                    {/* Usage Guide - Instructions with food context */}
                                    <div className="bg-white p-3 rounded-md border border-neutral-200">
                                      <div className="flex items-center mb-2">
                                        <ScrollText className="h-4 w-4 mr-2 text-neutral-500" />
                                        <h6 className="font-medium text-neutral-800">Usage Guide</h6>
                                      </div>
                                      <p className="text-sm text-neutral-700">{item.instructions}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Right Column - Benefits */}
                                  <div className="bg-white p-3 rounded-md border border-neutral-200">
                                    <div className="flex items-center mb-2">
                                      <HeartPulse className="h-4 w-4 mr-2 text-primary-500" />
                                      <h6 className="font-medium text-neutral-800">Why This Works For You</h6>
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
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
                                  <button 
                                    className="flex items-center px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md text-sm transition-all duration-150"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Open Ask AI modal with this supplement
                                      setSelectedSupplement(item);
                                      setIsAskAIModalOpen(true);
                                    }}
                                  >
                                    <Bot className="h-4 w-4 mr-2" />
                                    <span>Ask AI about this</span>
                                  </button>
                                  
                                  <button 
                                    className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm transition-all duration-150"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSupplement(item);
                                      setIsSwapModalOpen(true);
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    <span>Swap Supplement</span>
                                  </button>
                                  
                                  <button 
                                    className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm transition-all duration-150"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Find the correct index in the original supplementRoutine array
                                      const supplementIndex = supplementRoutine.findIndex(
                                        s => s.supplement === item.supplement && s.timeOfDay === item.timeOfDay
                                      );
                                      if (supplementIndex !== -1) {
                                        removeItem(supplementIndex);
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    <span>Remove from Routine</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pro Tips Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <h5 className="text-blue-800 font-medium">Pro Tips to Optimize Your Results</h5>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-amber-600 flex items-center justify-center" style={{ fontSize: '10px', height: '12px', width: '12px', lineHeight: 1 }}>✦</span>
                  </div>
                  <p className="text-sm text-blue-700">Taking Vitamin D3 and Fish Oil together? That's great! Both are fat-soluble and complement each other well at lunch.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-green-600 flex items-center justify-center" style={{ fontSize: '10px', height: '12px', width: '12px', lineHeight: 1 }}>✦</span>
                  </div>
                  <p className="text-sm text-blue-700">If you're sensitive to zinc, try it after a fuller lunch and not on an empty stomach.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                    <span className="text-purple-600 flex items-center justify-center" style={{ fontSize: '10px', height: '12px', width: '12px', lineHeight: 1 }}>✦</span>
                  </div>
                  <p className="text-sm text-blue-700">Try keeping your supplements in visible places as reminders - morning ones by your coffee maker, evening ones by your toothbrush.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Ask AI Modal */}
      {selectedSupplement && (
        <AskAIModal 
          isOpen={isAskAIModalOpen} 
          onClose={() => setIsAskAIModalOpen(false)}
          supplement={selectedSupplement}
          healthGoals={healthGoals}
        />
      )}
      
      {/* Swap Supplement Modal */}
      {selectedSupplement && (
        <SwapModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          supplement={selectedSupplement}
          healthGoals={healthGoals}
          onSwapSuccess={handleSwapSuccess}
        />
      )}
    </div>
  );
}