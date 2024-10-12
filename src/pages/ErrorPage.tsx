import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.scss";

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <h1>Oops!</h1>
      <p>Something went wrong. Please try again later.</p>
      <Link to="/" className={styles.homeLink}>
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default ErrorPage;
