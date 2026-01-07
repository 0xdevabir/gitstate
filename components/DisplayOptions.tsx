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
    { key: 'showContributions', label: 'Contributions' },
    { key: 'showJoinDate', label: 'Join Date' },
    { key: 'showLocation', label: 'Location' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-200">Display Options</h3>
      <div className="space-y-2">
        {displayOptions.map((option) => (
          <label key={option.key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={(options as any)[option.key]}
              onChange={(e) => onOptionChange(option.key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 cursor-pointer"
            />
            <span className="text-sm text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
