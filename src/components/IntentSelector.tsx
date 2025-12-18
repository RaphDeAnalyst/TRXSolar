interface IntentSelectorProps {
  onSelectIntent: (intent: 'estimate' | 'inquiry') => void;
  selectedIntent: 'estimate' | 'inquiry' | null;
}

export default function IntentSelector({ onSelectIntent, selectedIntent }: IntentSelectorProps) {
  const handleClick = (intent: 'estimate' | 'inquiry') => {
    onSelectIntent(intent);

    // Smooth scroll to form section
    const formSection = document.getElementById('contact-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-xl">
      <div className="flex flex-col sm:flex-row gap-md items-stretch">
        {/* Primary CTA - Get Estimate */}
        <button
          onClick={() => handleClick('estimate')}
          className={`flex-1 min-h-touch py-md px-xl font-medium rounded shadow-md transition-all ${
            selectedIntent === 'estimate'
              ? 'bg-primary text-surface ring-2 ring-primary ring-offset-2'
              : 'bg-primary text-surface hover:bg-primary-dark'
          }`}
          aria-label="Request custom solar system quote"
        >
          <span className="text-lg md:text-xl">Request Custom Quote</span>
        </button>

        {/* Secondary CTA - General Question */}
        <button
          onClick={() => handleClick('inquiry')}
          className={`flex-1 min-h-touch py-md px-xl font-medium rounded border-2 transition-all ${
            selectedIntent === 'inquiry'
              ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2'
              : 'border-primary text-primary hover:bg-primary/5'
          }`}
          aria-label="Message a solar expert"
        >
          <span className="text-lg md:text-xl">Message a Solar Expert</span>
        </button>
      </div>

      {/* Helpful text */}
      <p className="text-center text-body text-text-secondary mt-md">
        {selectedIntent === 'estimate'
          ? 'Complete the form below for a personalized solar estimate'
          : selectedIntent === 'inquiry'
          ? 'Ask us anything about solar energy'
          : 'Choose an option above to get started'}
      </p>
    </div>
  );
}
