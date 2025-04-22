import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LifestyleFormData } from "@/lib/types";

type LifestyleFormProps = {
  onSubmit: (data: LifestyleFormData) => void;
  onBack: () => void;
  defaultValues: LifestyleFormData;
  isLoading: boolean;
};

export default function LifestyleForm({
  onSubmit,
  onBack,
  defaultValues,
  isLoading
}: LifestyleFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LifestyleFormData>({
    defaultValues
  });
  
  const sleepQuality = watch("sleepQuality");
  const stressLevel = watch("stressLevel");
  
  const handleSleepQualityChange = (value: number[]) => {
    setValue("sleepQuality", value[0]);
  };
  
  const handleStressLevelChange = (value: number[]) => {
    setValue("stressLevel", value[0]);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step space-y-6">
      <h3 className="text-xl font-semibold mb-6">Tell us about your lifestyle</h3>
      
      {/* Sleep Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="wake-time" className="mb-1">
            Typical wake-up time
          </Label>
          <Input
            type="time"
            id="wake-time"
            {...register("wakeTime", { required: true })}
          />
        </div>
        
        <div>
          <Label htmlFor="sleep-time" className="mb-1">
            Typical bedtime
          </Label>
          <Input
            type="time"
            id="sleep-time"
            {...register("sleepTime", { required: true })}
          />
        </div>
      </div>
      
      {/* Sleep Quality */}
      <div>
        <Label className="mb-2">How would you rate your sleep quality?</Label>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500">Poor</span>
          <span className="text-xs text-neutral-500">Excellent</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[sleepQuality]}
          onValueChange={handleSleepQualityChange}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500">1</span>
          <span className="text-xs text-neutral-500">2</span>
          <span className="text-xs text-neutral-500">3</span>
          <span className="text-xs text-neutral-500">4</span>
          <span className="text-xs text-neutral-500">5</span>
        </div>
      </div>
      
      {/* Stress Level */}
      <div>
        <Label className="mb-2">How would you rate your stress level?</Label>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-500">Low stress</span>
          <span className="text-xs text-neutral-500">High stress</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[stressLevel]}
          onValueChange={handleStressLevelChange}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500">1</span>
          <span className="text-xs text-neutral-500">2</span>
          <span className="text-xs text-neutral-500">3</span>
          <span className="text-xs text-neutral-500">4</span>
          <span className="text-xs text-neutral-500">5</span>
        </div>
      </div>
      
      {/* Menstrual Phase */}
      <div>
        <Label htmlFor="menstrual-phase" className="mb-1">
          Menstrual Phase (if applicable)
        </Label>
        <Select
          onValueChange={(value) => setValue("menstrualPhase", value)}
          defaultValue={defaultValues.menstrualPhase}
        >
          <SelectTrigger id="menstrual-phase">
            <SelectValue placeholder="Not applicable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_applicable">Not applicable</SelectItem>
            <SelectItem value="follicular">Follicular phase (day 1-14)</SelectItem>
            <SelectItem value="ovulation">Ovulation (day 14-16)</SelectItem>
            <SelectItem value="luteal">Luteal phase (day 16-28)</SelectItem>
            <SelectItem value="menstruation">Menstruation (day 1-7)</SelectItem>
            <SelectItem value="postmenopausal">Postmenopausal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Diet Preferences */}
      <div>
        <Label htmlFor="diet-preference" className="mb-1">
          Diet Preference
        </Label>
        <Select
          onValueChange={(value) => setValue("dietPreference", value)}
          defaultValue={defaultValues.dietPreference}
        >
          <SelectTrigger id="diet-preference">
            <SelectValue placeholder="Select a diet preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="omnivore">Omnivore (eat everything)</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="pescatarian">Pescatarian</SelectItem>
            <SelectItem value="keto">Keto</SelectItem>
            <SelectItem value="paleo">Paleo</SelectItem>
            <SelectItem value="gluten-free">Gluten-free</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Food Allergies */}
      <div>
        <Label htmlFor="food-allergies" className="mb-1">
          Food Allergies or Intolerances
        </Label>
        <Input
          type="text"
          id="food-allergies"
          placeholder="e.g., dairy, nuts, gluten, etc."
          {...register("foodAllergies")}
        />
      </div>
      
      <div className="flex justify-between pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          size="lg"
          className="px-6"
        >
          ← Back
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading} 
          size="lg" 
          className="text-lg font-medium w-2/3 py-6"
        >
          {isLoading ? "Generating..." : "Generate Routine →"}
        </Button>
      </div>
    </form>
  );
}
