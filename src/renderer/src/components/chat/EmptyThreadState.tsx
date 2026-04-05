const emptyStateWidths = ['w-[190px]', 'w-[150px]', 'w-[170px]', 'w-[210px]'];

export const EmptyThreadState = () => {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6" aria-hidden="true">
      <div className="flex flex-col items-center gap-4">
        {emptyStateWidths.map((widthClass, index) => (
          <span
            key={widthClass}
            className={`h-3 rounded-full bg-zinc-600 ${widthClass} ${index === 0 ? 'opacity-100' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
