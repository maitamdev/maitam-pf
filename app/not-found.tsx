import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="route-state">
      <p>404 / UNCHARTED SPACE</p>
      <h1>This destination is not in the flight map.</h1>
      <span>Return to the portfolio or open the selected project archive.</span>
      <div className="route-state__actions">
        <Link href="/">Return home</Link>
        <Link href="/#projects">View projects</Link>
      </div>
    </main>
  );
}
