export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
        style={{ animation: "fade-in-up 1s ease-out both" }}
      >
        {/* Pill badge */}
        <div className="rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-neutral-400">
          Coming Soon
        </div>

        {/* Main heading */}
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
          Aesthetics{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #00e5ff 0%, #ffffff 50%, #00e5ff 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }}
          >
            CRM
          </span>
        </h1>

        {/* Tagline */}
        <p className="max-w-md text-lg font-light leading-relaxed text-neutral-400">
          A next-generation CRM built for aesthetics and medical practices.
        </p>

        {/* Divider */}
        <div className="mt-8 h-px w-24 bg-neutral-700" />

        {/* Footer */}
        <div
          className="mt-4 text-sm tracking-wide text-neutral-500"
          style={{ animation: "fade-in-up 1s ease-out 0.4s both" }}
        >
          A product by{" "}
          <a
            href="https://gammadevelopers.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#00e5ff] transition-opacity hover:opacity-80"
          >
            Gamma Developers
          </a>
        </div>
      </div>
    </div>
  );
}
