import React, { useState } from "react";
import { Auth } from "../src/types";
import { Link } from "react-router-dom";
const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resp, setResp] = useState<Auth.ApiResponse | null>(null);

  //   const [confirmPassword, setConfirmPassword] = useState<string>("");
  const styles = {
    form: { maxWidth: "40vw", display: "flex", flexDirection: "column" },
    error: { color: "red" },
    success: { color: "green" },
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch("http://localhost:4000/api_v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((res: Auth.ApiResponse) => setResp(res))
      .catch((err) => setResp(err));

    setUsername("");
    setPassword("");
    setEmail("");
  };
  return (
    <>
      <section>
        <h1>Register</h1>
        <h4 style={resp?.success ? styles.success : styles.error}>
          {resp && JSON.stringify(resp)}
        </h4>
        <form style={styles.form} action="" onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder={"Username"}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder={"Email"}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder={"Password"}
          />
          <br />
          <button>Submit</button>
        </form>
        <br />
        <p>
          {" "}
          {resp?.success ? <Link to="/login">You can login now</Link> : ""}
        </p>
      </section>
    </>
  );
};

export default Register;
