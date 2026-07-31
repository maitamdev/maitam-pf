"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="route-state">
      <p>NAVIGATION INTERRUPTED</p>
      <h1>This route lost its signal.</h1>
      <span>The rest of the universe is still online.</span>
      <div className="route-state__actions">
        <button type="button" onClick={reset}>
          Retry connection
        </button>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}
