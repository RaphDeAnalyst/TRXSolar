import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - VCSolar',
  description: 'Product management dashboard for VCSolar',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

/**
 * Admin Layout - Separate from public website
 *
 * This layout works with ConditionalLayout component in the root layout
 * to exclude public website components (Header, Footer, WhatsApp icon)
 * from admin routes.
 *
 * The admin page contains a minimal header with:
 * - System title ("VCSolar Admin")
 * - User information
 * - Logout button
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
