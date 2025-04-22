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
  const { register, handleSubmit, formState: { errors } } = useForm<HealthGoalsFormData>({
    defaultValues
  });
  const { toast } = useToast();

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleFormSubmit = (data: HealthGoalsFormData) => {
    if (selectedGoals.length === 0) {
      toast({
        title: "Please select at least one health goal",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      healthGoals: selectedGoals,
      otherGoals: data.otherGoals
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form-step">
      <h3 className="text-xl font-semibold mb-2">What are your health goals?</h3>
      <p className="text-neutral-600 mb-6">Select all that apply. You can choose multiple options.</p>
      
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
                className={`flex flex-col items-center justify-center p-4 h-full bg-white border-2 rounded-lg cursor-pointer transition-all hover:bg-neutral-50 relative ${
                  isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-neutral-200"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <Icon
                  className={`h-8 w-8 mb-2 ${
                    isSelected ? "text-primary-500" : "text-neutral-400"
                  }`}
                />
                <span className="font-medium text-center">{goal.label}</span>
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
          className="resize-none"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
}
