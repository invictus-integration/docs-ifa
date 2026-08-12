import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './info.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--info',
  icon: <FontAwesomeIcon icon={faCircleInfo} />,
  title: (
    <Translate
      id="theme.admonition.info"
      description="The default label used for the Info admonition (:::info)">
      info
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});
