import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Blue Heart Logo */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-full border border-blue-200 shadow-sm">
            <div className="relative h-7 w-7 flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-500" fill="currentColor" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-800">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Vita</span>
              <span className="text-neutral-700">Routine</span>
            </h1>
            <p className="text-xs text-neutral-500">Your Personal Supplement Expert</p>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-neutral-600 hover:text-blue-600 font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-neutral-600 hover:text-blue-600 font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-neutral-600 hover:text-blue-600 font-medium"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
