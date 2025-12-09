'use client';

import { useState } from 'react';
import { Contact } from '@/types';

interface AdminContactTableProps {
  contacts: Contact[];
  onUpdateStatus: (contactId: number, status: string) => void;
  onDelete: (contactId: number) => void;
}

export default function AdminContactTable({
  contacts,
  onUpdateStatus,
  onDelete,
}: AdminContactTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  const handleDeleteClick = (contactId: number) => {
    setDeleteConfirmId(contactId);
  };

  const handleConfirmDelete = (contactId: number) => {
    onDelete(contactId);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border border-border overflow-x-auto rounded">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Name</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Email</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Phone</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Message</th>
              <th className="text-center px-md py-sm text-body font-semibold text-text-primary">Status</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Date</th>
              <th className="text-center px-md py-sm text-body font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-background transition-colors">
                <td className="px-md py-sm text-body text-text-primary font-medium">
                  {contact.name}
                </td>
                <td className="px-md py-sm text-body text-text-secondary max-w-xs truncate">
                  {contact.email}
                </td>
                <td className="px-md py-sm text-body text-text-secondary">
                  {contact.phone || '-'}
                </td>
                <td className="px-md py-sm text-body text-text-secondary max-w-sm">
                  {truncateMessage(contact.message)}
                </td>
                <td className="px-md py-sm text-center">
                  <select
                    value={contact.status}
                    onChange={(e) => onUpdateStatus(contact.id, e.target.value)}
                    className={`px-sm py-xs rounded text-caption font-medium ${getStatusColor(contact.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-md py-sm text-body text-text-secondary whitespace-nowrap">
                  {formatDate(contact.created_at.toString())}
                </td>
                <td className="px-md py-sm">
                  <div className="flex items-center justify-center gap-xs">
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(contact.id)}
                      className="w-touch h-touch flex items-center justify-center text-error hover:bg-background rounded transition-colors"
                      aria-label="Delete contact"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-md">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-surface border border-border rounded p-md space-y-sm">
            {/* Contact Header */}
            <div className="flex items-start justify-between gap-sm">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-sans font-semibold text-text-primary">
                  {contact.name}
                </h3>
                <p className="text-caption text-text-secondary truncate">{contact.email}</p>
              </div>
              <select
                value={contact.status}
                onChange={(e) => onUpdateStatus(contact.id, e.target.value)}
                className={`px-sm py-xs rounded text-caption font-medium ${getStatusColor(contact.status)}`}
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Phone */}
            {contact.phone && (
              <div>
                <p className="text-caption text-text-secondary">Phone:</p>
                <p className="text-body text-text-primary">{contact.phone}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <p className="text-caption text-text-secondary mb-xs">Message:</p>
              <p className="text-body text-text-primary whitespace-pre-wrap">
                {expandedMessage === contact.id ? contact.message : truncateMessage(contact.message, 100)}
              </p>
              {contact.message.length > 100 && (
                <button
                  type="button"
                  onClick={() => setExpandedMessage(expandedMessage === contact.id ? null : contact.id)}
                  className="text-primary text-caption mt-xs hover:underline"
                >
                  {expandedMessage === contact.id ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Date */}
            <div className="text-caption text-text-secondary">
              {formatDate(contact.created_at.toString())}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-sm border-t border-border">
              <button
                type="button"
                onClick={() => handleDeleteClick(contact.id)}
                className="px-md py-sm min-h-touch text-error hover:bg-error/10 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sm bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-lg shadow-2xl max-w-md w-full p-lg">
            <h3 className="text-h3 font-bold text-text-primary mb-md">Confirm Delete</h3>
            <p className="text-body text-text-secondary mb-lg">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-sm">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-lg py-sm min-h-touch text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="px-lg py-sm min-h-touch bg-error text-white hover:bg-error/90 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
