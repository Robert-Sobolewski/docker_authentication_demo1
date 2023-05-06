import React from "react";
import { Link } from "react-router-dom";

const styles = {
  content: {
    paddingLeft: "2rem",
  },
};
const Home: React.FC = () => {
  return (
    <>
      <section>
        <h1>Home</h1>
        <dl>
          <dt>If you dont have an account</dt>
          <dd style={styles.content}>
            <Link to="/register">Create new account</Link>
          </dd>
        </dl>
        <br />
        <dt>If you have an account</dt>
        <dd style={styles.content}>
          <Link to="/login">Log in</Link>
        </dd>
      </section>
    </>
  );
};

export default Home;
