import { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./ProfileForm.module.css";

const WEB_API_KEY = process.env.REACT_APP_WEB_API_KEY;

const ProfileForm = () => {
  const newPswInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const token = authCtx.token;

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPsw = newPswInputRef.current.value;

    /* 인증 토큰 보내는 방법 3가지
    - 쿼리매개변수에 담아서 보낼수도 있음
    - headers에 "Authorization" : "Bearer abc" 담아서 보내기
    - body에 담아서 보내기
    */
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${WEB_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: enteredNewPsw,
          returnSecureToken: false, // 응답데이터를 받을건지 설정
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log("비밀번호 변경 실패");
          return res.json().then((data) => {
            let errorMsg = "비밀번호 변경 실패!!";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        {/* minLength: dev tool로 해당 속성을 삭제할 수 있기 때문에 다른 방법으로도 유효성 검사를 꼭 해야한다!! */}
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPswInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
