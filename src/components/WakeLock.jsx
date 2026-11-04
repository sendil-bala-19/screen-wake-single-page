import React, { useState } from "react";
import Blinker from "./Blinker";

function WakeLock() {
  const [toogle, setToggle] = useState(true);

  return (
    <div className="card">
      <div className="flex">
        <Blinker isOn={toogle} />
        <h2>WakeLock</h2>
      </div>
      <button onClick={() => setToggle(!toogle)}>Toggle</button>
    </div>
  );
}

export default WakeLock;
