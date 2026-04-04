import { ComposerDock } from './ComposerDock';

const emptyStateWidths = ['w-[190px]', 'w-[150px]', 'w-[170px]', 'w-[210px]'];

export const WorkspaceFrame = () => {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border-[5px] border-[#262626] bg-[#0d0d0d]">
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[5px]">
          <div className="flex flex-col items-center gap-4" aria-hidden="true">
            {emptyStateWidths.map((widthClass, index) => (
              <span
                key={widthClass}
                className={`h-3 rounded-full bg-zinc-600 ${widthClass} ${index === 0 ? 'opacity-100' : ''}`}
              />
            ))}
          </div>
          <ComposerDock />
        </div>
      </div>
    </section>
  );
};
