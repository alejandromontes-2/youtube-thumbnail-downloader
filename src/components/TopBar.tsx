export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__logo" aria-label="YT//THUMB">
          <span className="topbar__logo-mark">▶</span>
          <span className="topbar__logo-text">
            YT<span className="topbar__logo-slash">//</span>THUMB
          </span>
        </div>
        <span className="topbar__tag">a still-frame extractor</span>
      </div>
    </header>
  );
}
