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
import { Loader2, X, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define predefined alternatives instead of using OpenAI
// This approach removes the requirement for an API key

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

  // Predefined alternatives for common supplements
  const commonAlternatives: Record<string, SupplementRoutineItem[]> = {
    "vitamin d": [
      {
        supplement: "Vitamin K2 (100mcg)",
        instructions: "Take once daily with a fatty meal for optimal absorption. Best paired with calcium-rich foods.",
        reasoning: "Vitamin K2 works synergistically with vitamin D to support bone health by directing calcium to bones rather than soft tissues. It also supports cardiovascular health.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Life Extension or NOW Foods"
      },
      {
        supplement: "Cod Liver Oil (1000mg)",
        instructions: "Take one capsule with breakfast. Store in a cool place to prevent oxidation.",
        reasoning: "Natural source of vitamins A and D plus omega-3 fatty acids. Supports immune function, bone health, and reduces inflammation.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Nordic Naturals or Carlson"
      }
    ],
    "fish oil": [
      {
        supplement: "Algal Oil (500mg DHA/EPA)",
        instructions: "Take 1-2 capsules daily with food to minimize any aftertaste.",
        reasoning: "Plant-based alternative to fish oil that provides similar omega-3 benefits. Supports brain health, reduces inflammation, and is suitable for vegetarians and vegans.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Nordic Naturals or Deva"
      },
      {
        supplement: "Flaxseed Oil (1000mg)",
        instructions: "Take 1-2 capsules with meals. Can also be used in salad dressings or smoothies.",
        reasoning: "Rich in alpha-linolenic acid (ALA), a plant-based omega-3 that supports heart health and reduces inflammation. Budget-friendly alternative to fish oil.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Barlean's or Spectrum Naturals"
      }
    ],
    "magnesium": [
      {
        supplement: "Calcium Citrate (500mg)",
        instructions: "Take with dinner or before bed. Can be taken without food unlike some other forms of calcium.",
        reasoning: "Works synergistically with magnesium to support bone health, muscle function, and nervous system. Citrate form is better absorbed than carbonate forms.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Solgar or Pure Encapsulations"
      },
      {
        supplement: "Zinc Glycinate (15mg)",
        instructions: "Take with food to minimize stomach discomfort. Avoid taking with calcium supplements.",
        reasoning: "Supports immune function, wound healing, and protein synthesis. Plays a role in over 300 enzymatic reactions in the body similar to magnesium.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Thorne or Pure Encapsulations"
      }
    ],
    "probiotic": [
      {
        supplement: "Prebiotic Fiber (5g)",
        instructions: "Mix with water or add to smoothies. Start with a small dose and gradually increase to avoid gas or bloating.",
        reasoning: "Feeds beneficial gut bacteria rather than introducing new ones. Supports digestive health, immunity, and helps existing beneficial bacteria flourish.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Jarrow Formulas or Hyperbiotics"
      },
      {
        supplement: "Fermented Foods (1 serving)",
        instructions: "Include a serving of kimchi, sauerkraut, kefir, or yogurt with meals daily.",
        reasoning: "Natural source of probiotics with additional nutrients and enzymes. Supports gut health and provides a diverse array of beneficial bacteria.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "N/A - choose organic options when possible"
      }
    ],
    "vitamin c": [
      {
        supplement: "Quercetin (500mg)",
        instructions: "Take with meals to enhance absorption. Can be paired with vitamin C for enhanced effects.",
        reasoning: "Powerful antioxidant and natural antihistamine. Supports immune function and has anti-inflammatory properties similar to vitamin C.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Thorne or Pure Encapsulations"
      },
      {
        supplement: "Whole Food Vitamin C (250mg)",
        instructions: "Take with or without food. Divide doses throughout the day for optimal absorption if taking higher amounts.",
        reasoning: "Contains natural cofactors and bioflavonoids that enhance absorption and effectiveness compared to synthetic ascorbic acid.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Garden of Life or MegaFood"
      }
    ],
    "zinc": [
      {
        supplement: "Copper Glycinate (2mg)",
        instructions: "Take with food to minimize stomach discomfort. Important to balance with zinc intake.",
        reasoning: "Works in balance with zinc in the body. Supports immune function, collagen production, and iron metabolism.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "Pure Encapsulations or Thorne"
      },
      {
        supplement: "Selenium (200mcg)",
        instructions: "Take with food once daily. Do not exceed recommended dosage as selenium can be toxic at high levels.",
        reasoning: "Trace mineral that supports immune function and acts as an antioxidant. Works synergistically with zinc for thyroid function and immunity.",
        timeOfDay: supplement.timeOfDay,
        time: supplement.time,
        brand: "NOW Foods or Life Extension"
      }
    ]
  };

  // Generic alternatives for when no specific match is found
  const genericAlternatives: SupplementRoutineItem[] = [
    {
      supplement: "Multivitamin (Complete Formula)",
      instructions: "Take with breakfast or your largest meal of the day for optimal absorption of fat-soluble vitamins.",
      reasoning: "Provides a broad spectrum of essential nutrients that can help fill multiple nutritional gaps. Contains various vitamins and minerals that support overall health.",
      timeOfDay: supplement.timeOfDay,
      time: supplement.time,
      brand: "Thorne Basic Nutrients or Pure Encapsulations"
    },
    {
      supplement: "Greens Powder (1 scoop)",
      instructions: "Mix with water or add to a smoothie. Best taken earlier in the day.",
      reasoning: "Concentrated source of phytonutrients from various green vegetables and superfoods. Provides antioxidants and supports detoxification, immune function, and overall wellness.",
      timeOfDay: supplement.timeOfDay,
      time: supplement.time,
      brand: "Athletic Greens or Amazing Grass"
    },
    {
      supplement: "Adaptogenic Herb Blend (500mg)",
      instructions: "Take once or twice daily with or without food. Consistent daily use yields best results.",
      reasoning: "Helps the body adapt to physical and mental stressors. Supports energy, mood, immune function, and overall resilience.",
      timeOfDay: supplement.timeOfDay,
      time: supplement.time,
      brand: "Gaia Herbs or Himalaya"
    }
  ];

  const handleGenerateAlternative = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find matching alternatives based on the supplement name
      let alternatives: SupplementRoutineItem[] = [];
      
      // Search for alternatives based on key supplement terms
      const lowerCaseName = cleanName.toLowerCase();
      for (const [key, alts] of Object.entries(commonAlternatives)) {
        if (lowerCaseName.includes(key)) {
          alternatives = alts;
          break;
        }
      }
      
      // If no specific alternative was found, use generic ones
      if (alternatives.length === 0) {
        alternatives = genericAlternatives;
      }
      
      // Filter based on preference if applicable
      if (preference !== "any") {
        const prefText = preference.toLowerCase();
        let preferredAlts = alternatives.filter(alt => 
          alt.supplement.toLowerCase().includes(prefText) || 
          alt.reasoning.toLowerCase().includes(prefText) ||
          alt.instructions.toLowerCase().includes(prefText)
        );
        
        // If no preference-specific alternatives, use the original list
        if (preferredAlts.length > 0) {
          alternatives = preferredAlts;
        }
      }
      
      // Select a random alternative from the filtered list
      const randomIndex = Math.floor(Math.random() * alternatives.length);
      const selectedAlternative = alternatives[randomIndex];
      
      setAlternativeSupplement(selectedAlternative);
    } catch (err) {
      console.error("Error generating alternative:", err);
      setError("Failed to generate an alternative. Please try again.");
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