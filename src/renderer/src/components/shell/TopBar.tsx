type TopBarProps = {
  title: string;
};

export const TopBar = ({ title }: TopBarProps) => {
  return (
    <header className="flex h-12 items-center justify-center border-b border-white/[0.05] px-6">
      <h1 className="text-xs font-medium uppercase tracking-[0.4em] text-zinc-300">
        {title}
      </h1>
    </header>
  );
};
