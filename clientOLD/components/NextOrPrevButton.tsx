import { Button } from "primereact/button";

const NextOrPrevButton = ({
  activeIndex,
  setActiveIndex,
  type,
  disabled,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  type: "next" | "prev";
  disabled?: boolean;
}) => {
  const next = () => {
    setActiveIndex(activeIndex + 1);
  };

  const prev = () => {
    setActiveIndex(activeIndex - 1);
  };

  return (
    <Button
      icon={type === "next" ? "pi pi-arrow-right" : "pi pi-arrow-left"}
      iconPos={type === "next" ? "right" : "left"}
      label={type === "next" ? "Next" : "Back"}
      onClick={type === "next" ? next : prev}
      disabled={disabled}
      severity={type === "next" ? undefined : "secondary"}
    />
  );
};

export default NextOrPrevButton;
