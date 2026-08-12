import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './warning.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--warning',
  icon: <FontAwesomeIcon icon={faTriangleExclamation} />,
  title: (
    <Translate
      id="theme.admonition.warning"
      description="The default label used for the Warning admonition (:::warning)">
      warning
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});
