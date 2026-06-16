import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
} from '@fortawesome/free-regular-svg-icons';
import {
  faChevronUp, faEllipsis, faAnglesUp,
  faAnglesDown, faFolderPlus
} from '@fortawesome/free-solid-svg-icons';
import styles from './FolderHierarchy.module.css';

export type HierarchyNode = {
  /** 'folder' renders a folder icon; 'flow' renders a flow/layer icon */
  type: 'folder' | 'flow';
  /** Display name of the folder or flow */
  name: string;
  /** Child nodes (folders and/or flows nested inside this folder) */
  children?: HierarchyNode[];
};

type FolderHierarchyProps = {
  items: HierarchyNode[];
};

function Row({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) {
  const isFolder = node.type === 'folder';
  return (
    <>
      <div
        className={`${styles.row} ${node.highlighted ? styles.rowHighlighted : ''}`}
        style={{ paddingLeft: `${14 + depth * 20}px` }}
      >
        <span className={`${styles.itemIcon} ${isFolder ? styles.rowFolder : styles.rowFlow}`}>
          {isFolder ? <FontAwesomeIcon icon={faFolder} /> : <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="chakra-icon css-w8v3vn" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"></path></svg>}
        </span>
        <span className={styles.itemName}>{node.name}</span>
        <span className={styles.itemActions}>
          <FontAwesomeIcon icon={faEllipsis} className={styles.ellipsis} />
          {isFolder && (
            <FontAwesomeIcon
              icon={faChevronUp}
              className={styles.chevron}
            />
          )}
        </span>
      </div>
      {isFolder && node.children?.map((child, i) => (
        <Row key={i} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

/**
 * Renders a visual representation of the Invictus Dashboard "Your Flows" sidebar panel.
 * Use this instead of a static screenshot to show folder/flow hierarchies with real names.
 *
 * @example
 * <FlowTree items={[
 *   {
 *     type: 'folder', name: 'Invoicing', expanded: true, highlighted: true,
 *     children: [
 *       { type: 'flow', name: 'Invoice Request' },
 *       { type: 'flow', name: 'Invoice Approval' },
 *     ]
 *   }
 * ]} />
 */
export default function FolderHierarchy({ items }: FolderHierarchyProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Your Flows</span>
        <span className={styles.headerActions}>
          <FontAwesomeIcon icon={faAnglesUp} aria-label="Collapse all" />
          <FontAwesomeIcon icon={faAnglesDown} aria-label="Expand all" />
          <FontAwesomeIcon icon={faFolderPlus} aria-label="New folder" />
        </span>
      </div>
      <div className={styles.list}>
        {items.map((item, i) => (
          <Row key={i} node={item} depth={0} />
        ))}
      </div>
    </div>
  );
}