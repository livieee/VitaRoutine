import { SupplementRoutineItem, CalendarOptions } from "./types";

// Function to generate and download an iCal file
export const generateICalFile = async (
  routine: SupplementRoutineItem[],
  options: CalendarOptions
): Promise<void> => {
  try {
    const response = await fetch("/api/calendar/ical", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routine,
        options,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate iCal file");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplement-routine.ics";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error generating iCal file:", error);
    throw error;
  }
};

// Function to create a Google Calendar URL
export const addToGoogleCalendar = (
  routine: SupplementRoutineItem[],
  options: CalendarOptions
): string => {
  // This is a simplified version - in a real app, we would generate proper Google Calendar links
  // For demonstration purposes, we're only generating a single event for the first supplement
  if (routine.length === 0) {
    throw new Error("No routine items to add to calendar");
  }

  const firstItem = routine[0];
  const title = `Take ${firstItem.supplement}`;
  const details = `${firstItem.instructions}\n\n${firstItem.reasoning}`;
  
  // Get today's date for the start time
  const today = new Date();
  
  // Parse the time from the routine item (e.g., "7:30 AM")
  const [timePart, ampm] = firstItem.time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  
  // Set the correct hours based on AM/PM
  let hour = hours;
  if (ampm === "PM" && hours < 12) {
    hour += 12;
  } else if (ampm === "AM" && hours === 12) {
    hour = 0;
  }
  
  // Create start and end times
  const startTime = new Date(today);
  startTime.setHours(hour, minutes, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + 15);
  
  // Format dates for Google Calendar
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startTimeStr = formatDate(startTime);
  const endTimeStr = formatDate(endTime);

  // Create Google Calendar URL
  let url = `https://www.google.com/calendar/render?action=TEMPLATE`;
  url += `&text=${encodeURIComponent(title)}`;
  url += `&dates=${startTimeStr}/${endTimeStr}`;
  url += `&details=${encodeURIComponent(details)}`;
  
  if (options.reminder15Min) {
    url += `&reminder=15`;
  }

  return url;
};
