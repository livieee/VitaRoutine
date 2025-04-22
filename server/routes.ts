import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRecommendations } from "./openai";
import ical from "ical-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate personalized recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { healthGoals, lifestyle } = req.body;
      
      if (!healthGoals || !lifestyle) {
        return res.status(400).json({ message: "Missing health goals or lifestyle data" });
      }
      
      const recommendations = await generateRecommendations(healthGoals, lifestyle);
      return res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return res.status(500).json({ 
        message: "Failed to generate recommendations",
        error: error.message
      });
    }
  });

  // Generate iCal file for calendar export
  app.post("/api/calendar/ical", async (req, res) => {
    try {
      const { routine, options } = req.body;
      
      if (!routine || !Array.isArray(routine) || routine.length === 0) {
        return res.status(400).json({ message: "Invalid routine data" });
      }
      
      // Create iCal calendar
      const calendar = ical({
        name: "Supplement Routine",
        timezone: "UTC"
      });
      
      // Add events for each supplement
      routine.forEach(item => {
        // Parse the time from the routine item (e.g., "7:30 AM")
        const [timePart, ampm] = item.time.split(" ");
        const [hours, minutes] = timePart.split(":").map(Number);
        
        // Set the correct hours based on AM/PM
        let hour = hours;
        if (ampm === "PM" && hours < 12) {
          hour += 12;
        } else if (ampm === "AM" && hours === 12) {
          hour = 0;
        }
        
        // Create start and end times for today
        const today = new Date();
        const start = new Date(today);
        start.setHours(hour, minutes, 0, 0);
        
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 15);
        
        // Add event to calendar
        calendar.createEvent({
          start,
          end,
          summary: `Take ${item.supplement}`,
          description: `${item.instructions}\n\n${item.reasoning}`,
          repeating: {
            freq: 'DAILY'
          },
          alarms: options?.reminder15Min ? [
            {
              type: 'display',
              trigger: 900 // 15 minutes before in seconds
            }
          ] : []
        });
      });
      
      // Set content type and send the calendar
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', 'attachment; filename="supplement-routine.ics"');
      res.send(calendar.toString());
    } catch (error) {
      console.error("Error generating iCal file:", error);
      return res.status(500).json({ 
        message: "Failed to generate iCal file",
        error: error.message
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
