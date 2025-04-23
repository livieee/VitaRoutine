import { useState, useEffect } from "react";
import ProgressTracker from "@/components/ProgressTracker";
import HealthGoalsForm from "@/components/forms/HealthGoalsForm";
import LifestyleForm from "@/components/forms/LifestyleForm";
import RoutineDisplay from "@/components/results/RoutineDisplay";
import FoodSuggestions from "@/components/results/FoodSuggestions";
import CalendarSync from "@/components/results/CalendarSync";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  HealthGoalsFormData, 
  LifestyleFormData, 
  RecommendationResponse,
  SupplementRoutineItem,
  FoodSuggestion 
} from "@/lib/types";

// Function to load routine from localStorage
const loadSavedRoutine = (): RecommendationResponse | null => {
  try {
    const savedData = localStorage.getItem("vitaRoutine");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate that the data has the expected structure
      if (Array.isArray(parsedData) && parsedData.length > 0 && 
          'supplement' in parsedData[0] && 'timeOfDay' in parsedData[0]) {
        // We only saved the supplementRoutine, so create a proper RecommendationResponse
        return {
          supplementRoutine: parsedData as SupplementRoutineItem[],
          foodSuggestions: {
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: []
          } as FoodSuggestion
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error loading saved routine:", error);
    return null;
  }
};

export default function RoutineGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthGoalsData, setHealthGoalsData] = useState<HealthGoalsFormData>({
    healthGoals: [],
    otherGoals: ""
  });
  const [lifestyleData, setLifestyleData] = useState<LifestyleFormData>({
    wakeTime: "07:00",
    sleepTime: "23:00",
    sleepQuality: 3,
    stressLevel: 3,
    menstrualPhase: "not_applicable",
    dietPreference: "omnivore",
    foodAllergies: ""
  });
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [hasSavedRoutine, setHasSavedRoutine] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check for saved routine on component mount
  useEffect(() => {
    const savedRoutine = loadSavedRoutine();
    if (savedRoutine) {
      setHasSavedRoutine(true);
    }
  }, []);
  
  // Function to load saved routine and skip to results
  const loadSavedRoutineAndShow = () => {
    const savedRoutine = loadSavedRoutine();
    if (savedRoutine) {
      setRecommendations(savedRoutine);
      
      // Try to load saved health goals
      try {
        const savedHealthGoals = localStorage.getItem("vitaHealthGoals");
        if (savedHealthGoals) {
          const parsedHealthGoals = JSON.parse(savedHealthGoals);
          if (Array.isArray(parsedHealthGoals)) {
            setHealthGoalsData({
              ...healthGoalsData,
              healthGoals: parsedHealthGoals,
            });
          }
        } else {
          // If no saved health goals, set a default
          setHealthGoalsData({
            ...healthGoalsData,
            healthGoals: ["general health"],
          });
        }
      } catch (error) {
        console.error("Error loading saved health goals:", error);
        // Set default health goal if there's an error
        setHealthGoalsData({
          ...healthGoalsData,
          healthGoals: ["general health"],
        });
      }
      
      setCurrentStep(3); // Skip to results
      toast({
        title: "Routine Loaded",
        description: "Your saved supplement routine has been loaded successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Could not load saved routine. It may be corrupted or deleted.",
        variant: "destructive",
        duration: 3000,
      });
      setHasSavedRoutine(false);
    }
  };

  const generateRecommendation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/recommendations", {
        healthGoals: healthGoalsData,
        lifestyle: lifestyleData
      });
      return res.json() as Promise<RecommendationResponse>;
    },
    onSuccess: (data) => {
      setRecommendations(data);
      setCurrentStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate recommendations: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleHealthGoalsSubmit = (data: HealthGoalsFormData) => {
    setHealthGoalsData(data);
    setCurrentStep(2);
  };

  const handleLifestyleSubmit = (data: LifestyleFormData) => {
    setLifestyleData(data);
    generateRecommendation.mutate();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (recommendations && recommendations.supplementRoutine) {
      try {
        // Save the supplement routine to localStorage
        localStorage.setItem("vitaRoutine", JSON.stringify(recommendations.supplementRoutine));
        
        // Also save the health goals for context
        localStorage.setItem("vitaHealthGoals", JSON.stringify(healthGoalsData.healthGoals));
        
        setHasSavedRoutine(true);
        toast({
          title: "Success",
          description: "Your supplement routine has been saved successfully!",
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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <ProgressTracker currentStep={currentStep} totalSteps={3} />
      
      <div className="max-w-3xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <>
            {hasSavedRoutine && (
              <div className="mb-8 bg-primary-50 p-4 rounded-lg border border-primary-100">
                <h4 className="text-primary-800 font-medium mb-2">Welcome back!</h4>
                <p className="text-neutral-700 mb-4">
                  We found your previously saved supplement routine. Would you like to view it?
                </p>
                <Button 
                  className="flex items-center" 
                  onClick={loadSavedRoutineAndShow}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Load My Saved Routine
                </Button>
              </div>
            )}
            <HealthGoalsForm 
              onSubmit={handleHealthGoalsSubmit}
              defaultValues={healthGoalsData}
            />
          </>
        )}
        
        {currentStep === 2 && (
          <LifestyleForm 
            onSubmit={handleLifestyleSubmit}
            onBack={handleBack}
            defaultValues={lifestyleData}
            isLoading={generateRecommendation.isPending}
          />
        )}
        
        {currentStep === 3 && recommendations && (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Your Personalized Supplement Routine</h3>
              <p className="text-neutral-600">
                Based on your goals and lifestyle, here's a scientifically backed supplement and nutrition plan.
              </p>
            </div>
            
            <RoutineDisplay 
              supplementRoutine={recommendations.supplementRoutine} 
              healthGoals={healthGoalsData.healthGoals}
            />
            <FoodSuggestions foodSuggestions={recommendations.foodSuggestions} />
            <CalendarSync supplementRoutine={recommendations.supplementRoutine} />
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button onClick={handleSave}>
                Save Routine
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
