'use client';

import { EntityManager } from '@/components/admin/EntityManager';

export default function StylesAdmin() {
  return (
    <EntityManager
      title="Beer styles"
      singular="Style"
      subtitle="The filters on Our Products. A style only appears on the site when it has at least one published beer. A style with beers can’t be deleted: hide it, or move its beers first."
      endpoint="/admin/styles"
      searchPlaceholder="Search styles…"
      defaults={{ name: '', pluralName: '', published: true }}
      fields={[
        { name: 'name', label: 'Name (singular)', type: 'text', required: true, help: 'e.g. Lager. Shown on each beer.' },
        { name: 'pluralName', label: 'Filter label (plural)', type: 'text', required: true, help: 'e.g. Lagers. Also used for the web address when created.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Style', render: (r) => <strong>{r.name}</strong> },
        { label: 'Filter label', render: (r) => r.pluralName },
        { label: 'Slug', render: (r) => <code style={{ fontSize: 12 }}>{r.slug}</code> },
        { label: 'Beers', render: (r) => r.productCount ?? 0 },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      emptyText="No styles yet."
      rowLabel={(r) => r.name}
    />
  );
}
