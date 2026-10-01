import React, { useState } from "react";
import StudioIcon from "../StudioIcon";
import "./AdminLogin.css";

type Props = {
  navigate: (to: string) => void;
  onAuthenticated: () => void;
};

const adminCredentials = [{ username: "admin", password: "admin123" }];

export default function AdminLogin({ navigate, onAuthenticated }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notice, setNotice] = useState("");

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = adminCredentials.some(
      (credential) =>
        credential.username === username.trim() &&
        credential.password === password,
    );
    if (isValid) {
      setNotice("");
      onAuthenticated();
      return;
    }
    setNotice("Username or password is invalid.");
  };

  return (
    <main className="admin-login-screen">
      <button
        className="admin-home-button"
        type="button"
        aria-label="Return to home page"
        title="Return to home page"
        onClick={() => navigate("/")}
      >
        <StudioIcon name="home" />
      </button>

      <section className="admin-login-frame" aria-label="Administrator sign in">
        <div className="admin-login-aside">
          <div className="admin-login-brand">
            <span className="admin-brand-mark">J</span>
            <span>
              JANVI <i>MAKEOVER</i>
            </span>
          </div>
          <div className="admin-aside-copy">
            <p className="admin-eyebrow">STUDIO TEAM · PRIVATE ACCESS</p>
            <h1>
              Good work
              <br />
              starts <em>behind</em>
              <br />
              the scenes.
            </h1>
            <p>
              Sign in to manage the day, care for your clients, and keep the
              studio running beautifully.
            </p>
          </div>
          <div className="admin-aside-stamp" aria-hidden="true">
            <span>JM</span>
            <i>✳</i>
          </div>
          <div className="admin-aside-bottom">
            <span>VARANASI, INDIA</span>
            <span>EST. WITH CARE</span>
          </div>
        </div>

        <div className="admin-login-panel">
          <div className="admin-login-panel-top">
            <span>TEAM PORTAL</span>
            <span className="admin-secure-label">
              <i /> SECURE SIGN IN
            </span>
          </div>
          <div className="admin-login-heading">
            <p className="admin-eyebrow">WELCOME BACK</p>
            <h2>
              Sign in to your
              <br />
              <em>studio account.</em>
            </h2>
            <p>Enter your team credentials to continue.</p>
          </div>

          <form className="admin-login-form" onSubmit={submitLogin}>
            <label className="admin-login-field">
              <span>Username</span>
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setNotice("");
                }}
                required
              />
            </label>
            <label className="admin-login-field">
              <span>Password</span>
              <span className="admin-password-control">
                <input
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setNotice("");
                  }}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  onClick={() => setPasswordVisible((visible) => !visible)}
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <button className="admin-login-submit" type="submit">
              Sign in <span aria-hidden="true">↗</span>
            </button>
            {notice && (
              <p className="admin-login-notice" role="status">
                {notice}
              </p>
            )}
          </form>

          <div className="admin-login-help">
            <span className="admin-help-line" />
            <p>Need access? Contact your studio administrator.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
