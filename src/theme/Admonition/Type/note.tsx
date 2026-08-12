import Translate from '@docusaurus/Translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import createAdmonitionType from './createAdmonitionType';
import styles from './note.module.css';

export default createAdmonitionType({
  infimaClassName: 'alert alert--note',
  icon: <FontAwesomeIcon icon={faNoteSticky} />,
  title: (
    <Translate
      id="theme.admonition.note"
      description="The default label used for the Note admonition (:::note)">
      note
    </Translate>
  ),
  admonitionClassName: styles.admonition,
});
