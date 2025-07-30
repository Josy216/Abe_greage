const Unauthorized: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="text-center p-4">
        <h1 className="display-4 text-danger">
          <i className="bi bi-shield-exclamation"></i> Unauthorized
        </h1>
        <p className="lead text-dark mt-3">
          You don&apos;t have the authorization to access the page you
          requested.
        </p>
        <a href="/" className="btn btn-danger mt-4">
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default Unauthorized;
