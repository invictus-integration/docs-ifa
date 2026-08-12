import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './praise.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--praise',
  icon: <FontAwesomeIcon icon={faAward} />,
  title: (
    <Translate
      id="theme.admonition.praise"
      description="The default label used for the Praise admonition (:::praise)">
      praise
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});