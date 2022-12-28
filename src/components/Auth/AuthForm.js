import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const WEB_API_KEY = process.env.REACT_APP_WEB_API_KEY;

const AuthForm = () => {
  const emailInputRef = useRef();
  const pswInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPsw = pswInputRef.current.value;

    setIsLoading(true);

    if (isLogin) {
      // 로그인 모드일 때
    } else {
      // 회원가입 모드일 때
      fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${WEB_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPsw,
            returnSecureToken: true,
          }),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        if (res.ok) {
          // ...
        } else {
          console.log("회원가입 실패!!");
          return res.json().then((data) => {
            // 회원가입 실패 사용자 피드백 추가
            let errorMsg = "Authentication failed!";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            alert(errorMsg);
          });
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={pswInputRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
