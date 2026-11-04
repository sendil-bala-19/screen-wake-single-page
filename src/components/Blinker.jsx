import "./Blinker.less";

const Blinker = ({ isOn = false }) => {
  return (
    <span className={`blinker ${isOn ? "blinker--on" : "blinker--off"}`} />
  );
};

export default Blinker;
