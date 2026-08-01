import "./Spinner.css";

// Shared loading indicator used in place of bare "Loading..." text across pages.
function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap">
      <span className="spinner" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}

export default Spinner;
