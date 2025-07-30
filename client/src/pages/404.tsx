const NotFound: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="text-center p-4">
        <h1 className="display-6 text-danger">
          <i className="bi bi-exclamation-triangle"></i> 404 Not Found
        </h1>
        <p className="lead text-dark mt-3">
          The page you are looking for could not be found.
        </p>
        <a href="/" className="btn btn-outline-danger mt-4">
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
