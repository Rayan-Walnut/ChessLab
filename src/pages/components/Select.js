import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionner...',
  icon: Icon,
  className = '',
  multiple = false,
  searchable = true,
  clearable = true,
  containerClassName = '', // Nouvelle prop pour styliser le conteneur
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : null);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedOptions(multiple ? (Array.isArray(value) ? value : [value]) : value);
    }
  }, [value, multiple]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (multiple) {
      const newSelection = selectedOptions.includes(option.value)
        ? selectedOptions.filter(item => item !== option.value)
        : [...selectedOptions, option.value];
      setSelectedOptions(newSelection);
      onChange?.(newSelection);
    } else {
      setSelectedOptions(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOptions(multiple ? [] : null);
    onChange?.(multiple ? [] : null);
    setSearchTerm('');
  };

  const getSelectedLabels = () => {
    if (!selectedOptions) return placeholder;
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      return selectedOptions.length === 1
        ? options.find(opt => opt.value === selectedOptions[0])?.label
        : `${selectedOptions.length} sélectionnés`;
    }
    return options.find(opt => opt.value === selectedOptions)?.label || placeholder;
  };

  return (
    <div ref={selectRef} className={`relative w-96 ${containerClassName}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white
          border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? 'ring-2 ring-gray-500/20 border-gray-500' : ''}
          ${className}
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {Icon && (
            <Icon
              size={20}
              className={`flex-shrink-0 text-gray-400 ${isOpen ? 'text-gray-500' : ''}`}
            />
          )}
          <span className={`block truncate ${selectedOptions ? 'text-gray-900' : 'text-gray-500'}`}>
            {getSelectedLabels()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {clearable && selectedOptions && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`
              text-gray-400 transition-transform duration-200
              ${isOpen ? 'transform rotate-180 text-gray-500' : ''}
            `}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2">
          <div className="
            bg-white
            rounded-xl shadow-lg
            border border-gray-100
            overflow-hidden
            max-h-96
          ">
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-8 py-2 rounded-lg bg-gray-50 border-none focus:ring-0 text-sm"
                    placeholder="Rechercher..."
                  />
                  <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}
            
            <div className="overflow-auto max-h-72 z-50 overflow-x-hidden">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? selectedOptions.includes(option.value)
                    : selectedOptions === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full px-4 py-2.5
                        flex items-center justify-between
                        text-left
                        hover:bg-gray-50
                        rounded
                        m-2
                        ${isSelected ? 'text-gray-500 bg-gray-50' : 'text-gray-900'}
                      `}
                    >
                      <span className="flex items-center gap-3">
                        {option.icon && <option.icon size={18} />}
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check size={18} className="text-gray-500" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;