// Reusable Bootstrap spinner. "light" variant works on dark/colored backgrounds (like the hero),
// default "success" variant works on light backgrounds (like the page body).
function Spinner() {
  return (
    <div className="mt-3">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
