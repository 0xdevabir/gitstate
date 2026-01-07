'use client';

interface DisplayOptionsProps {
  options: {
    showRepositories: boolean;
    showFollowers: boolean;
    showStars: boolean;
    showLanguages: boolean;
    showJoinDate: boolean;
    showLocation: boolean;
    showName: boolean;
    showContributions: boolean;
    showCharts: boolean;
    showStreak: boolean;
    showLanguageChart: boolean;
  };
  onOptionChange: (option: string, value: boolean) => void;
}

export default function DisplayOptions({ options, onOptionChange }: DisplayOptionsProps) {
  const displayOptions = [
    { key: 'showName', label: 'Name & Username' },
    { key: 'showRepositories', label: 'Repositories' },
    { key: 'showFollowers', label: 'Followers' },
    { key: 'showStars', label: 'Total Stars' },
    { key: 'showLanguages', label: 'Top Languages' },
    { key: 'showLanguageChart', label: 'Language Chart' },
    { key: 'showContributions', label: 'Contributions' },
    { key: 'showCharts', label: 'Contribution Chart' },
    { key: 'showStreak', label: 'Streak Stats' },
    { key: 'showJoinDate', label: 'Join Date' },
    { key: 'showLocation', label: 'Location' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-200">Display Options</h3>
      <div className="space-y-2">
        {displayOptions.map((option) => (
          <label key={option.key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={(options as any)[option.key]}
              onChange={(e) => onOptionChange(option.key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-300 select-none">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
