'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import MessageViewerModal from '@/components/ui/MessageViewerModal';

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
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('📊 [ContactTable] Component rendered with contacts:', contacts.length);
    console.log('📊 [ContactTable] First contact:', contacts[0]);
  }, [contacts]);

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

  const handleViewMessage = (contact: Contact) => {
    setViewingContact(contact);
  };

  const handleCloseModal = () => {
    setViewingContact(null);
  };

  const formatDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleString('en-US', {
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
                <td className="px-md py-sm text-body text-text-secondary whitespace-nowrap">
                  {formatDate(contact.created_at)}
                </td>
                <td className="px-md py-sm">
                  <div className="flex items-center justify-center gap-xs">
                    {/* View Button */}
                    <button
                      type="button"
                      onClick={() => handleViewMessage(contact)}
                      className="w-touch h-touch flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-colors"
                      aria-label="View message"
                      title="View message"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(contact.id)}
                      className="w-touch h-touch flex items-center justify-center text-error hover:bg-error/10 rounded transition-colors"
                      aria-label="Delete contact"
                      title="Delete contact"
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
            </div>

            {/* Phone */}
            {contact.phone && (
              <div>
                <p className="text-caption text-text-secondary">Phone:</p>
                <p className="text-body text-text-primary">{contact.phone}</p>
              </div>
            )}

            {/* Date */}
            <div className="text-caption text-text-secondary">
              {formatDate(contact.created_at)}
            </div>

            {/* Actions */}
            <div className="flex gap-sm pt-sm border-t border-border">
              <button
                type="button"
                onClick={() => handleViewMessage(contact)}
                className="flex-1 px-md py-sm min-h-touch bg-primary text-white font-sans font-semibold hover:bg-primary-dark rounded transition-colors flex items-center justify-center gap-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(contact.id)}
                className="w-touch h-touch flex items-center justify-center text-error hover:bg-error/10 rounded transition-colors"
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
          </div>
        ))}
      </div>

      {/* Message Viewer Modal */}
      <MessageViewerModal
        isOpen={viewingContact !== null}
        onClose={handleCloseModal}
        contact={viewingContact}
        onUpdateStatus={onUpdateStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={handleCancelDelete}
        onConfirm={() => handleConfirmDelete(deleteConfirmId!)}
        title="Delete Contact?"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
