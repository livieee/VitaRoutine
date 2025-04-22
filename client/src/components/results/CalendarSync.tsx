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
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
        <h4 className="font-medium text-neutral-800">Sync to Calendar</h4>
      </div>
      
      <div className="p-4">
        <p className="text-neutral-700 mb-4">
          Add your supplement routine to your preferred calendar service:
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleExportICal}
          >
            <Calendar className="h-5 w-5 mr-2" />
            <span>Export iCal File</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleAddToGoogleCalendar}
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="5" width="14" height="2" fill="#EA4335" />
              <rect x="5" y="9" width="14" height="2" fill="#FBBC04" />
              <rect x="5" y="13" width="14" height="2" fill="#34A853" />
              <rect x="5" y="17" width="14" height="2" fill="#4285F4" />
            </svg>
            <span>Add to Google Calendar</span>
          </Button>
        </div>
        
        <div className="mt-6">
          <h5 className="font-medium mb-2">Set Reminder Preferences</h5>
          <div className="flex items-center mb-2 space-x-2">
            <Checkbox 
              id="reminder-15min" 
              checked={reminder15Min}
              onCheckedChange={(checked) => setReminder15Min(checked as boolean)} 
            />
            <Label htmlFor="reminder-15min" className="text-neutral-700">
              15 minutes before
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reminder-notification" 
              checked={reminderNotification}
              onCheckedChange={(checked) => setReminderNotification(checked as boolean)} 
            />
            <Label htmlFor="reminder-notification" className="text-neutral-700">
              Send mobile notification
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
