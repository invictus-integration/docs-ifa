import OriginalDocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';

export default function DocSidebarItemCategory({ item, ...props }) {
  const ariaLabel = item.customProps?.ariaLabel;

  return (
    <OriginalDocSidebarItemCategory
      item={item}
      {...props}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    />
  );
}
