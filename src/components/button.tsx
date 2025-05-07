import React from "react";

export const buttonStyle =
  "bg-green-500 cursor-pointer flex space-x-0.5 justify-center items-center   max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl";

export const Button = ({
  text,
  icon,
}: {
  text: string;
  icon?: React.JSX.Element;
}) => {
  if (icon) {
    return (
      <button className={buttonStyle}>
        {icon}
        <p>{text}</p>
      </button>
    );
  }

  return <button className={buttonStyle}>{text}</button>;
};
