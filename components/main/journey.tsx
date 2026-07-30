export const Journey = () => {
  return (
    <section
      id="experience"
      aria-labelledby="journey-title"
      className="relative mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10"
    >
      <div className="mb-12 max-w-2xl">
        <h2
          id="journey-title"
          className="text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          Education &amp; Experience
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-400">
          My academic foundation and professional experience in full-stack
          software development.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-[#2A0E61] bg-[#09031c]/70 p-6 shadow-lg shadow-[#2A0E61]/10 md:p-8">
          <p className="text-sm font-medium text-[#b49bff]">Education</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Hung Vuong University
          </h3>
          <p className="mt-2 text-lg text-gray-300">Software Engineering</p>
          <p className="mt-5 max-w-md leading-relaxed text-gray-400">
            Final-year student focused on building practical web, mobile and
            AI-powered software products.
          </p>
        </article>

        <article className="rounded-xl border border-[#2A0E61] bg-gradient-to-br from-[#12062b]/90 to-[#070217]/90 p-6 shadow-lg shadow-[#2A0E61]/10 md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#b49bff]">Experience</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                FullStack Developer
              </h3>
              <p className="mt-2 text-lg text-gray-300">Valley Campus</p>
            </div>
            <p className="whitespace-nowrap text-sm font-medium text-gray-400">
              Jan 2025 - Feb 2026
            </p>
          </div>
          <p className="mt-5 max-w-xl leading-relaxed text-gray-400">
            Full-stack development using Odoo.
          </p>
          <div className="mt-6 inline-flex rounded-lg border border-[#7042f88b] px-3 py-2 text-sm font-medium text-gray-200">
            Odoo
          </div>
        </article>
      </div>
    </section>
  );
};
