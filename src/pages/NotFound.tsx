import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className={styles.homeLink}>
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
