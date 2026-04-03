import { useAppStore } from './store/app-store';

export const App = () => {
  const title = useAppStore((state) => state.title);
  const platform = window.shellbase.getPlatform();
  const versions = window.shellbase.getVersions();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(60,80,120,0.28),transparent_40%),linear-gradient(180deg,#0d1117_0%,#090b10_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.38em] text-slate-400">
            {title}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Electron scaffold initialized.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Main, preload, and renderer are split and wired. The chat-first IDE
            shell comes next.
          </p>

          <dl className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="text-slate-400">Platform</dt>
              <dd className="mt-2 font-medium text-white">{platform}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="text-slate-400">Electron</dt>
              <dd className="mt-2 font-medium text-white">
                {versions.electron}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="text-slate-400">Chrome</dt>
              <dd className="mt-2 font-medium text-white">{versions.chrome}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="text-slate-400">Node</dt>
              <dd className="mt-2 font-medium text-white">{versions.node}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
};
