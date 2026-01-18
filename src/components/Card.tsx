import React from "react";

export default function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${props.className ?? ""}`}>
      {props.title ? <div className="cardTitle">{props.title}</div> : null}
      <div className="cardBody">{props.children}</div>
    </div>
  );
}
