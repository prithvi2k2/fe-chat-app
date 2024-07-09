import Register from "./Register";
import Login from "./Login";
import { useState } from "react";

export default function Auth() {
  const [register, setRegister] = useState(false);
  const options = ["Login", "Register"];
  const changeAuth = (event) => {
    if (event.target.value == "Register") setRegister(true);
    else setRegister(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 rounded-xl p-2">
        {options.map((option) => (
          <div key={option}>
            <input
              type="radio"
              id={option}
              name="authRadio"
              value={option}
              defaultChecked={option === "Login"}
              className="peer hidden"
              onChange={changeAuth}
            />
            <label
              htmlFor={option}
              className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {register ? <Register /> : <Login />}
    </div>
  );
}
