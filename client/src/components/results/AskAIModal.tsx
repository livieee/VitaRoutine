import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import { SupplementRoutineItem } from "@/lib/types";

type AskAIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  supplement: SupplementRoutineItem;
  healthGoals: string[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AskAIModal({ isOpen, onClose, supplement, healthGoals }: AskAIModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Initialize with welcome message
  useEffect(() => {
    if (isOpen) {
      // Clear previous messages when opening with a new supplement
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your supplement assistant. Ask me anything about ${getCleanName(supplement.supplement)}.`
        }
      ]);
    }
  }, [isOpen, supplement]);
  
  // Helper to get clean name
  const getCleanName = (supplementName: string): string => {
    return supplementName.replace(/\s*\([^)]*\)/, '').trim();
  };
  
  // Get dosage from supplement name if available
  const getDosage = (supplementName: string): string | null => {
    const dosageMatch = supplementName.match(/\(([^)]+)\)/);
    return dosageMatch ? dosageMatch[1] : null;
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: inputValue,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Prepare the conversation context for the API
    const cleanName = getCleanName(supplement.supplement);
    const dosage = getDosage(supplement.supplement) || "Not specified";
    
    try {
      // In a real implementation, this would be an API call to OpenAI or similar service
      // For now, simulate a response with a timeout
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: generateSimulatedResponse(userMessage.content, supplement, cleanName, dosage, healthGoals),
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
      
      // Future implementation with real API:
      /*
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          supplement: cleanName,
          dosage,
          timeOfDay: supplement.timeOfDay,
          instructions: supplement.instructions,
          reasoning: supplement.reasoning,
          healthGoals: healthGoals,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: data.response,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      */
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I had trouble generating a response. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // This function generates a simulated response based on the supplement info
  // In a real implementation, this would be replaced with an actual LLM API call
  const generateSimulatedResponse = (
    question: string, 
    supplement: SupplementRoutineItem, 
    name: string, 
    dosage: string, 
    healthGoals: string[]
  ): string => {
    // Convert question to lowercase for easier matching
    const q = question.toLowerCase();
    
    // Check for common question patterns
    if (q.includes("side effect") || q.includes("risk")) {
      return `${name} is generally well-tolerated at the recommended dosage (${dosage}). Common side effects may include mild digestive discomfort when taken on an empty stomach. That's why I recommend taking it ${supplement.instructions.toLowerCase().includes("with food") ? "with food" : "as directed in your usage guide"}. Always consult with a healthcare provider for your specific situation.`;
    }
    
    if (q.includes("when") || q.includes("time") || q.includes("take")) {
      return `For best results, take ${name} during ${supplement.timeOfDay.toLowerCase()} (${supplement.time}). ${supplement.instructions}`;
    }
    
    if (q.includes("benefit") || q.includes("good for") || q.includes("why")) {
      return `${name} supports your ${healthGoals.join(" and ")} goals by: ${supplement.reasoning}`;
    }
    
    if (q.includes("alternative") || q.includes("substitute") || q.includes("instead")) {
      return `If you're looking for alternatives to ${name}, you might consider options like ${getAlternativesForSupplement(name)}. Each has a similar function but may work through different mechanisms. Would you like more detailed information about any of these alternatives?`;
    }
    
    if (q.includes("food") || q.includes("meal") || q.includes("eat")) {
      const foodContext = supplement.instructions.match(/with ([^.]+)/i);
      const foodSuggestion = foodContext ? foodContext[1] : "a balanced meal";
      return `It's best to take ${name} ${supplement.instructions.toLowerCase().includes("with food") ? `with ${foodSuggestion}` : "as directed in your usage guide"}. This helps with absorption and minimizes any potential digestive discomfort.`;
    }
    
    // Default response for other questions
    return `Thanks for asking about ${name}! Based on your health goals (${healthGoals.join(", ")}), ${name} was recommended because ${supplement.reasoning.split('.')[0]}. The suggested dosage is ${dosage}, to be taken during ${supplement.timeOfDay} (${supplement.time}). ${supplement.instructions} Is there something more specific you'd like to know?`;
  };
  
  // Helper function to provide realistic alternatives based on supplement name
  const getAlternativesForSupplement = (name: string): string => {
    const supplementAlternatives: Record<string, string> = {
      'Vitamin D3': 'sunlight exposure, fortified foods, or Vitamin D2',
      'Omega-3': 'flaxseed oil, algae oil (for vegans), or eating fatty fish directly',
      'Magnesium': 'magnesium glycinate, magnesium malate, or increasing magnesium-rich foods in your diet',
      'Zinc': 'zinc picolinate, food sources like oysters and pumpkin seeds',
      'Vitamin C': 'whole food vitamin C, camu camu, or acerola cherry',
      'Probiotics': 'fermented foods, different probiotic strains, or prebiotic fiber',
      'CoQ10': 'ubiquinol (more bioavailable form) or PQQ',
      'Vitamin B12': 'methylcobalamin, adenosylcobalamin, or B-complex',
      'Iron': 'heme iron sources, non-heme plant sources with vitamin C, or different iron formulations',
      'Calcium': 'calcium citrate, plant sources of calcium, or bone broth',
      'Vitamin A': 'beta-carotene, mixed carotenoids, or retinol',
      'Collagen': 'bone broth, glycine-rich foods, or plant-based collagen boosters',
      'Melatonin': 'glycine, L-theanine, or magnesium before bed',
      'Glutathione': 'NAC (N-acetyl cysteine), alpha-lipoic acid, or sulfur-rich foods',
      'Turmeric': 'ginger, boswellia, or other anti-inflammatory herbs',
    };
    
    // Check for exact match or partial match
    const exactMatch = supplementAlternatives[name];
    if (exactMatch) return exactMatch;
    
    // Check for partial matches
    for (const supplement in supplementAlternatives) {
      if (name.toLowerCase().includes(supplement.toLowerCase())) {
        return supplementAlternatives[supplement];
      }
    }
    
    // Default alternatives if no match found
    return "other similar supplements with comparable benefits, whole food sources of similar nutrients, or lifestyle modifications to support the same health goal";
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="font-medium">Ask AI about {getCleanName(supplement.supplement)}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" 
                    ? "bg-primary-100 text-primary-900" 
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about this supplement..."
              className="flex-1 border rounded-md px-3 py-2 h-10 min-h-[40px] max-h-20 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 rounded-full ${
                isLoading || !inputValue.trim()
                  ? "bg-gray-100 text-gray-400"
                  : "bg-primary-100 text-primary-600 hover:bg-primary-200"
              }`}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Ask any questions about this supplement's benefits, usage, or alternatives. 
          </p>
        </div>
      </div>
    </div>
  );
}