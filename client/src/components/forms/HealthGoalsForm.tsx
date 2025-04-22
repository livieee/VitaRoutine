import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { HealthGoalsFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Zap, 
  Moon, 
  Paintbrush, 
  ShieldCheck, 
  Heart 
} from "lucide-react";

type HealthGoalsFormProps = {
  onSubmit: (data: HealthGoalsFormData) => void;
  defaultValues: HealthGoalsFormData;
};

const HEALTH_GOALS = [
  { id: "antiaging", label: "Anti-aging", icon: Clock },
  { id: "energy", label: "Energy", icon: Zap },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "skinHealth", label: "Skin Health", icon: Paintbrush },
  { id: "immunity", label: "Immunity", icon: ShieldCheck },
  { id: "digestion", label: "Digestion", icon: Heart },
];

export default function HealthGoalsForm({ onSubmit, defaultValues }: HealthGoalsFormProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(defaultValues.healthGoals || []);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<HealthGoalsFormData>({
    defaultValues: {
      ...defaultValues,
      healthGoals: selectedGoals
    }
  });
  const { toast } = useToast();

  const toggleGoal = (goalId: string) => {
    let newSelectedGoals;
    if (selectedGoals.includes(goalId)) {
      newSelectedGoals = selectedGoals.filter(g => g !== goalId);
    } else {
      newSelectedGoals = [...selectedGoals, goalId];
    }
    setSelectedGoals(newSelectedGoals);
    setValue('healthGoals', newSelectedGoals);
    console.log("Selected goals:", newSelectedGoals);
  };

  const handleFormSubmit = (data: HealthGoalsFormData) => {
    if (selectedGoals.length === 0) {
      toast({
        title: "Please select at least one health goal",
        variant: "destructive",
      });
      return;
    }
    
    const submitData = {
      healthGoals: selectedGoals,
      otherGoals: data.otherGoals
    };
    console.log("Submitting form data:", submitData);
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form-step">
      <h3 className="text-xl font-semibold mb-2">What are your health goals?</h3>
      <p className="text-neutral-600 mb-2">Select all that apply. You can choose multiple options.</p>
      <div className="flex items-center mb-6 p-2 bg-blue-50 rounded text-blue-700 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>Click on any goal below to select it. Selected goals will be highlighted.</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {HEALTH_GOALS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          
          return (
            <div className="relative" key={goal.id}>
              <input
                type="checkbox"
                id={`goal-${goal.id}`}
                className="peer sr-only"
                checked={isSelected}
                onChange={() => toggleGoal(goal.id)}
              />
              <label
                htmlFor={`goal-${goal.id}`}
                className={`flex flex-col items-center justify-center p-4 h-full bg-white border-2 rounded-lg cursor-pointer interactive-card relative ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 shadow-lg transform scale-[1.02]"
                    : "border-neutral-200 hover:border-primary-200"
                } ${isSelected ? "pulse-animation" : ""}`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-lg"></div>
                )}

                <Icon
                  className={`h-8 w-8 mb-2 ${
                    isSelected ? "text-primary-500" : "text-neutral-400"
                  }`}
                />
                <span className="font-medium text-center mb-2">{goal.label}</span>
                <button 
                  type="button"
                  className={`mt-1 text-sm px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center min-w-[80px] ${
                    isSelected 
                      ? "text-white bg-primary-500 hover:bg-primary-600 shadow-sm" 
                      : "text-primary-500 bg-white border border-primary-300 hover:bg-primary-50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleGoal(goal.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Select
                    </>
                  ) : (
                    "Select"
                  )}
                </button>
              </label>
            </div>
          );
        })}
      </div>
      
      <div className="mb-6">
        <Label htmlFor="other-goals" className="mb-1">
          Any specific concerns or goals not listed above?
        </Label>
        <Textarea
          id="other-goals"
          placeholder="e.g., Joint pain, hormone balance, etc."
          {...register("otherGoals")}
          className="resize-none enhanced-input focus:border-primary-300 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
          rows={3}
        />
      </div>
      
      <div className="flex justify-center w-full mt-6">
        <Button type="submit" size="lg" className="text-lg font-medium w-full sm:w-1/2 py-6 button-gradient border-none shadow-lg">
          Continue to Next Step →
        </Button>
      </div>
    </form>
  );
}
