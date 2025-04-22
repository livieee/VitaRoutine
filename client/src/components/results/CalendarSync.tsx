import { useState } from "react";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SupplementRoutineItem } from "@/lib/types";
import { generateICalFile, addToGoogleCalendar } from "@/lib/calendar";

type CalendarSyncProps = {
  supplementRoutine: SupplementRoutineItem[];
};

export default function CalendarSync({ supplementRoutine }: CalendarSyncProps) {
  const [reminder15Min, setReminder15Min] = useState(true);
  const [reminderNotification, setReminderNotification] = useState(true);
  const { toast } = useToast();

  const handleExportICal = async () => {
    try {
      await generateICalFile(supplementRoutine, {
        reminder15Min,
        reminderNotification
      });
      toast({
        title: "Success",
        description: "Calendar file downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate calendar file",
        variant: "destructive",
      });
    }
  };

  const handleAddToGoogleCalendar = async () => {
    try {
      const url = addToGoogleCalendar(supplementRoutine, {
        reminder15Min,
        reminderNotification
      });
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to Google Calendar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-8 shadow-md transition-all duration-300 hover:shadow-lg content-section entered">
      <div className="bg-gradient-to-r from-primary-50 via-neutral-50 to-neutral-100 px-4 py-3 border-b border-neutral-200">
        <h4 className="font-medium text-neutral-800 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary-500" />
          Sync to Calendar
        </h4>
      </div>
      
      <div className="p-4">
        <p className="text-neutral-700 mb-4">
          Add your supplement routine to your preferred calendar service:
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="flex items-center interactive-card hover:border-primary-300 hover:shadow-md px-6 py-5"
            onClick={handleExportICal}
          >
            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
            <span>Export iCal File</span>
          </Button>
          
          <Button
            className="flex items-center button-gradient border-none shadow-lg px-6 py-5 text-white"
            onClick={handleAddToGoogleCalendar}
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="5" width="14" height="2" fill="white" />
              <rect x="5" y="9" width="14" height="2" fill="white" />
              <rect x="5" y="13" width="14" height="2" fill="white" />
              <rect x="5" y="17" width="14" height="2" fill="white" />
            </svg>
            <span>Add to Google Calendar</span>
          </Button>
        </div>
        
        <div className="mt-8 border border-neutral-100 rounded-lg p-4 bg-neutral-50">
          <h5 className="font-medium mb-4 text-neutral-800 flex items-center">
            <Check className="h-4 w-4 mr-2 text-primary-500" />
            Set Reminder Preferences
          </h5>
          
          <div className="space-y-3 pl-2">
            <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-white p-2 rounded-md">
              <Checkbox 
                id="reminder-15min" 
                checked={reminder15Min}
                onCheckedChange={(checked) => setReminder15Min(checked as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-primary"
              />
              <Label htmlFor="reminder-15min" className="text-neutral-700 cursor-pointer">
                15 minutes before supplement time
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-white p-2 rounded-md">
              <Checkbox 
                id="reminder-notification" 
                checked={reminderNotification}
                onCheckedChange={(checked) => setReminderNotification(checked as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-primary"
              />
              <Label htmlFor="reminder-notification" className="text-neutral-700 cursor-pointer">
                Send mobile notification
              </Label>
            </div>
          </div>
          
          <p className="text-xs text-neutral-500 mt-4 italic">
            These settings will be applied to all calendar events when syncing.
          </p>
        </div>
      </div>
    </div>
  );
}
