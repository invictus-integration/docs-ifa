import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './tip.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--success',
  icon: <FontAwesomeIcon icon={faLightbulb} />,
  title: (
    <Translate
      id="theme.admonition.tip"
      description="The default label used for the Tip admonition (:::tip)">
      tip
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});
