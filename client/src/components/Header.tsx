import { Heart, Pill, ExternalLink } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-50 p-2 rounded-full">
            <Pill className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-800">
              <span className="text-primary-600">Vita</span>Routine
            </h1>
            <p className="text-xs text-neutral-500">www.vitaroutine.com</p>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-neutral-600 hover:text-primary-600 font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-neutral-600 hover:text-primary-600 font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-neutral-600 hover:text-primary-600 font-medium"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="https://www.vitaroutine.com/blog"
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
