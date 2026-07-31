export default function Loading() {
  return (
    <main id="main-content" className="route-state" aria-live="polite">
      <div className="route-state__signal" aria-hidden="true" />
      <p>MAITAMDEV / NAVIGATION</p>
      <h1>Calibrating the next destination</h1>
      <div className="route-state__track" aria-hidden="true">
        <span />
      </div>
    </main>
  );
}
