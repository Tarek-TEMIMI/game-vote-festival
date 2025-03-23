
import { useState } from 'react';
import { Check } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  onFilterChange: (selected: string[]) => void;
  className?: string;
}

const CategoryFilter = ({ 
  categories, 
  onFilterChange,
  className = ""
}: CategoryFilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newSelected);
    onFilterChange(newSelected);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    onFilterChange([]);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      >
        <span className="text-sm">
          {selectedCategories.length === 0
            ? 'Filtrer par catégorie'
            : `${selectedCategories.length} catégorie${selectedCategories.length > 1 ? 's' : ''} sélectionnée${selectedCategories.length > 1 ? 's' : ''}`}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-zoom-in">
          <div className="py-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-center w-5 h-5 mr-3 border rounded border-gray-300 bg-white">
                  {selectedCategories.includes(category) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="text-sm">{category}</span>
              </div>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-1.5 text-sm text-center text-primary hover:bg-gray-100 rounded"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
