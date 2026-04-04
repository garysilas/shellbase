import { ComposerDock } from './ComposerDock';
import { TopBar } from './TopBar';

type WorkspaceFrameProps = {
  title: string;
};

const emptyStateWidths = ['w-[190px]', 'w-[150px]', 'w-[170px]', 'w-[210px]'];

export const WorkspaceFrame = ({ title }: WorkspaceFrameProps) => {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#262626] px-0">
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border border-white/[0.05] bg-[#0d0d0d]">
        <TopBar title={title} />
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
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
