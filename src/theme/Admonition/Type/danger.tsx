import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './danger.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--danger',
  icon: <FontAwesomeIcon icon={faFire} />,
  title: (
    <Translate
      id="theme.admonition.danger"
      description="The default label used for the Danger admonition (:::danger)">
      danger
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});
