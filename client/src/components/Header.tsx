import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-neutral-800">VitaRoutine</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 font-medium"
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
