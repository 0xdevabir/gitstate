'use client';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = [
    { id: 'dark', label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    { id: 'light', label: 'Light', preview: 'bg-gray-100 border-gray-300' },
    { id: 'neon', label: 'Neon', preview: 'bg-purple-900 border-purple-500' },
    { id: 'ocean', label: 'Ocean', preview: 'bg-blue-900 border-blue-500' },
    { id: 'tokyo', label: 'Tokyo', preview: 'bg-indigo-900 border-indigo-500' },
    { id: 'dracula', label: 'Dracula', preview: 'bg-pink-900 border-pink-500' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-200">Theme</h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`p-2 rounded-lg border-2 transition-all text-xs ${
              selectedTheme === theme.id
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className={`w-full h-6 rounded ${theme.preview}`} />
            <p className="text-xs mt-1 text-gray-300">{theme.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
