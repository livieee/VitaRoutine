import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SupplementRoutineItem } from "@/lib/types";
import { Loader2, X, CheckCircle2, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024
// Do not change this unless explicitly requested by the user
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplement: SupplementRoutineItem;
  healthGoals: string[];
  onSwapSuccess: (originalItem: SupplementRoutineItem, newItem: SupplementRoutineItem) => void;
}

const userPreferences = [
  { value: "any", label: "Any Alternative" },
  { value: "vegan", label: "Vegan Option" },
  { value: "budget", label: "Budget-Friendly" },
  { value: "natural", label: "Natural Alternative" },
  { value: "food-based", label: "Food-Based Option" },
  { value: "non-gmo", label: "Non-GMO Option" },
  { value: "organic", label: "Organic Option" },
];

export default function SwapModal({
  isOpen,
  onClose,
  supplement,
  healthGoals,
  onSwapSuccess,
}: SwapModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preference, setPreference] = useState("any");
  const [alternativeSupplement, setAlternativeSupplement] = useState<SupplementRoutineItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cleans up the supplement name by removing dosage information
  const getCleanName = (supplementName: string): string => {
    return supplementName.replace(/\s*\([^)]*\)/, "").trim();
  };

  // Extract dosage from supplement name if available
  const getDosage = (supplementName: string): string | null => {
    const dosageMatch = supplementName.match(/\(([^)]+)\)/);
    return dosageMatch ? dosageMatch[1] : null;
  };

  const cleanName = getCleanName(supplement.supplement);
  const supplementDosage = getDosage(supplement.supplement);

  const handleGenerateAlternative = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare health goals text
      const goalsText = healthGoals && healthGoals.length > 0 
        ? healthGoals.join(", ") 
        : "general health";
      
      // Create the prompt for GPT-4o
      const prompt = `
You are a supplements expert assistant helping suggest an alternative supplement.

Original supplement details:
- Name: ${cleanName}
- Dosage: ${supplementDosage || "Not specified"}
- Time of day: ${supplement.timeOfDay} (${supplement.time})
- Instructions: ${supplement.instructions}
- Reasoning/Benefits: ${supplement.reasoning}
- Health goals: ${goalsText}

User preference: ${preference !== "any" ? preference : "Any suitable alternative"}

Suggest ONE alternative to ${cleanName} that:
1. Supports the same health goals
2. Serves a similar function
3. Matches the user preference if specified (${preference})

Return ONLY a valid JSON object with these exact keys:
{
  "supplement": "Name (with dosage in parentheses)",
  "instructions": "Clear instructions on how/when to take it",
  "reasoning": "Brief explanation of why this is a good alternative",
  "timeOfDay": "${supplement.timeOfDay}",
  "time": "${supplement.time}",
  "brand": "Suggested brand (optional)"
}
`;

      // Call the OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const responseText = response.choices[0].message.content;
      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      try {
        const alternativeData = JSON.parse(responseText) as SupplementRoutineItem;
        setAlternativeSupplement(alternativeData);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Failed to parse the AI response. Please try again.");
      }
    } catch (err) {
      console.error("Error generating alternative:", err);
      setError("Failed to generate an alternative. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSwap = () => {
    if (!alternativeSupplement) return;
    
    // Call the onSwapSuccess callback with the new supplement
    onSwapSuccess(supplement, alternativeSupplement);
    
    // Show success toast
    toast({
      title: "Supplement Swapped",
      description: `${cleanName} has been replaced with ${getCleanName(alternativeSupplement.supplement)}.`,
      duration: 3000,
    });
    
    // Close the modal and reset state
    handleClose();
  };

  const handleClose = () => {
    // Reset state
    setAlternativeSupplement(null);
    setError(null);
    setPreference("any");
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center">
            <span className="mr-2">🔄</span> Swap Supplement
          </DialogTitle>
          <DialogDescription>
            Replace {cleanName} with an alternative that serves a similar function.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Original Supplement */}
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Current Supplement</h3>
            <div className="flex items-start">
              <div className="flex-1">
                <p className="font-medium text-neutral-800">
                  💊 {cleanName}
                  {supplementDosage && (
                    <span className="ml-1 text-sm font-normal text-neutral-500">
                      ({supplementDosage})
                    </span>
                  )}
                </p>
                <p className="text-sm text-neutral-600 mt-1">{supplement.timeOfDay} • {supplement.time}</p>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{supplement.instructions}</p>
              </div>
            </div>
          </div>

          {/* Preference Selection */}
          <div className="space-y-2">
            <label htmlFor="preference" className="text-sm font-medium text-neutral-700">
              Select Preference for Alternative
            </label>
            <Select value={preference} onValueChange={setPreference}>
              <SelectTrigger id="preference" className="w-full">
                <SelectValue placeholder="Select a preference" />
              </SelectTrigger>
              <SelectContent>
                {userPreferences.map((pref) => (
                  <SelectItem key={pref.value} value={pref.value}>
                    {pref.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          {!alternativeSupplement && !isLoading && (
            <Button 
              onClick={handleGenerateAlternative} 
              className="w-full"
            >
              Generate Alternative
            </Button>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-neutral-600 text-center">
                Finding an alternative for {cleanName}...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-red-700 text-sm">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Alternative Supplement */}
          {alternativeSupplement && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                  Alternative Found
                </h3>
                <Button
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setAlternativeSupplement(null)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              
              <div className="flex items-start mt-2">
                <div className="flex-1">
                  <p className="font-medium text-neutral-800">
                    💊 {getCleanName(alternativeSupplement.supplement)}
                    {getDosage(alternativeSupplement.supplement) && (
                      <span className="ml-1 text-sm font-normal text-neutral-500">
                        ({getDosage(alternativeSupplement.supplement)})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {alternativeSupplement.timeOfDay} • {alternativeSupplement.time}
                  </p>
                  
                  {/* Instructions */}
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-neutral-700">Instructions:</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      {alternativeSupplement.instructions}
                    </p>
                  </div>
                  
                  {/* Reasoning */}
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-neutral-700">Why This Alternative Works:</h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      {alternativeSupplement.reasoning}
                    </p>
                  </div>
                  
                  {/* Brand if available */}
                  {alternativeSupplement.brand && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-neutral-700">Suggested Brand:</h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        {alternativeSupplement.brand}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {alternativeSupplement && (
            <Button onClick={handleConfirmSwap}>
              Confirm Swap
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}