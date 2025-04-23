import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo and Description */}
          <div className="max-w-md mb-6">
            <div className="flex items-center justify-center space-x-1.5 mb-3">
              {/* Empty Blue Heart Logo (smaller version) */}
              <div className="flex items-end">
                <Heart className="h-5 w-5 text-blue-500 stroke-2 mb-0.5" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-800">
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Vita</span>
                <span className="text-neutral-700">Routine</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-500 mb-2">
              Science-backed supplement and nutrition recommendations 
              tailored to your specific health goals and lifestyle.
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Your Personal Supplement Expert
            </p>
          </div>
        
          {/* Copyright */}
          <div className="border-t border-neutral-200 w-full pt-4">
            <p className="text-center text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} VitaRoutine. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}