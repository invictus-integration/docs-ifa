import React from "react";
import Link from "@docusaurus/Link";
import styles from "./ComponentCard.module.css";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ComponentCardProps = {
  /** Path to the component icon, relative to /static (e.g. "/img/icons/pubsub.png") */
  icon: string;
  /** Component name displayed as the card title */
  name: string;
  /** Short uppercase label shown below the name — acts as a category or hook */
  tagline: string;
  /** One or two sentences describing what the component does */
  description: string;
  /** Target URL — the component's documentation page */
  href: string;
};

export default function ComponentCard({ icon, name, tagline, description, href }: ComponentCardProps) {
  return (
    <Link to={href} className={styles.card}>
      <div className={styles.iconBlock}>
        <img src={icon} alt={`${name} icon`} />
      </div>
      <p className={styles.name}>{name}</p>
      <p className={styles.tagline}>{tagline}</p>
      <hr className={styles.divider} />
      <p className={styles.description}>{description}</p>
      <p className={styles.link}>Learn more <FontAwesomeIcon icon={faAnglesRight} /></p>
    </Link>
  );
}
