/**
 * Table Row Skeleton Loader for Admin Contact Table
 *
 * A skeleton UI component that mimics the structure of contact table rows.
 * Used in AdminContactTable during data fetching.
 *
 * Design adherence:
 * - Uses neutral gray tones from design_system.md
 * - Mirrors table row structure: Name, Email, Phone, Date, Actions
 * - Includes subtle animation to signal active loading
 * - Provides both desktop table view and mobile card view skeletons
 */

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse" aria-label="Loading contact" role="status">
      <td className="px-md py-sm">
        <div className="h-5 w-32 bg-gray-200 rounded" />
      </td>
      <td className="px-md py-sm">
        <div className="h-5 w-48 bg-gray-200 rounded" />
      </td>
      <td className="px-md py-sm">
        <div className="h-5 w-28 bg-gray-200 rounded" />
      </td>
      <td className="px-md py-sm">
        <div className="h-5 w-36 bg-gray-200 rounded" />
      </td>
      <td className="px-md py-sm">
        <div className="flex items-center justify-center gap-xs">
          <div className="w-touch h-touch bg-gray-200 rounded" />
          <div className="w-touch h-touch bg-gray-200 rounded" />
        </div>
      </td>
      <span className="sr-only">Loading contact information...</span>
    </tr>
  );
}

export function MobileContactCardSkeleton() {
  return (
    <div
      className="bg-surface border border-border rounded p-md space-y-sm animate-pulse"
      aria-label="Loading contact"
      role="status"
    >
      {/* Contact Header */}
      <div className="flex items-start justify-between gap-sm">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      {/* Date */}
      <div className="h-3 w-36 bg-gray-200 rounded" />

      {/* Actions */}
      <div className="flex gap-sm pt-sm border-t border-border">
        <div className="flex-1 h-touch bg-gray-200 rounded" />
        <div className="w-touch h-touch bg-gray-200 rounded" />
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading contact information...</span>
    </div>
  );
}
