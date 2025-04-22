import { useState } from "react";
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
  RecommendationResponse 
} from "@/lib/types";

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
    menstrualPhase: "",
    dietPreference: "omnivore",
    foodAllergies: ""
  });
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const { toast } = useToast();

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
    toast({
      title: "Success",
      description: "Your routine has been saved successfully!",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <ProgressTracker currentStep={currentStep} totalSteps={3} />
      
      <div className="max-w-3xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <HealthGoalsForm 
            onSubmit={handleHealthGoalsSubmit}
            defaultValues={healthGoalsData}
          />
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
            
            <RoutineDisplay supplementRoutine={recommendations.supplementRoutine} />
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
