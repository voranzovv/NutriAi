// Reusable Bootstrap alert for displaying error messages consistently across the app.
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      className="alert alert-danger mt-3 mx-auto"
      style={{ maxWidth: "400px" }}
    >
      {message}
    </div>
  );
}

export default ErrorMessage;
