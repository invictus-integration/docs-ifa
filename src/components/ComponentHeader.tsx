import React from "react";
import styles from "./ComponentHeader.module.css";

type ComponentHeaderProps = {
  /** Path to the component icon, relative to /static (e.g. "/img/icons/pubsub.png") */
  icon: string;
  /** Component name, used as the page <h1> */
  name: string;
  /** Short one-liner description — also used as the icon's alt text for screen readers */
  tagline: string;
};

export default function ComponentHeader({ icon, name, tagline }: ComponentHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.iconBlock}>
        <img src={icon} alt={`${name} component icon — ${tagline}`} />
      </div>
      <div className={styles.meta}>
        <h1>{name}</h1>
        <p className={styles.tagline}>{tagline}</p>
      </div>
    </div>
  );
}
