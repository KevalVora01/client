import { useState, useEffect, useRef, useMemo } from 'react';
import { complaintApi } from '../api/complaintApi';
import type { Comment, ComplaintStatus } from '../types/complaint.types';
import useAuth from '../../../hooks/useAuth';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

interface ComplaintCommentsProps {
  complaintId: number;
  status: ComplaintStatus;
  residentName: string;
  isAdmin: boolean;
}

const AVATAR_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#2563eb'];

function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const ComplaintComments = ({ complaintId, status, residentName, isAdmin }: ComplaintCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const isResolved = status === 'Resolved';
  const currentUserId = user?.id;

  const otherPerson = useMemo(() => {
    if (isAdmin) {
      return { name: residentName, initials: getInitials(residentName), color: getAvatarColor(0) };
    }
    const adminComment = comments.find((c) => c.userId !== currentUserId && c.user?.name);
    const name = adminComment?.user?.name ?? 'Admin';
    return { name, initials: getInitials(name), color: getAvatarColor(adminComment?.userId ?? 1) };
  }, [isAdmin, residentName, comments, currentUserId]);

  const fetchComments = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const data = await complaintApi.getComments(complaintId);
      setComments(data);
      setLoaded(true);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load comments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintId]);

  useEffect(() => {
    if (!loading && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [comments, loading]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await complaintApi.addComment(complaintId, newComment.trim());
      setNewComment('');
      const data = await complaintApi.getComments(complaintId);
      setComments(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to add comment'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* ── Header ── */}
      <div
        className="d-flex align-items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8f9fb' }}
      >
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold text-white"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: otherPerson.color,
            fontSize: '0.8rem',
          }}
        >
          {otherPerson.initials}
        </div>
        <div>
          <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>
            {otherPerson.name}
          </p>
          <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>
            {comments.length} message{comments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={messagesRef}
        className="flex-grow-1 d-flex flex-column"
        style={{
          overflowY: 'auto',
          padding: '16px 16px 8px',
          gap: '14px',
          backgroundColor: '#f0f2f5',
          minHeight: '240px',
          maxHeight: '400px',
        }}
      >
        {loading ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="d-flex gap-3">
                <div className="skeleton flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div className="flex-grow-1 d-flex flex-column gap-2">
                  <div className="skeleton" style={{ width: '120px', height: '10px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ width: '200px', height: '28px', borderRadius: '12px' }} />
                </div>
              </div>
            ))}
          </>
        ) : comments.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
            <i className="bi bi-chat-dots text-secondary" style={{ fontSize: '2rem', opacity: 0.3 }} />
            <p className="text-secondary mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMine = comment.userId === currentUserId;

            if (isMine) {
              return (
                <div key={comment.id} className="d-flex justify-content-end" style={{ paddingLeft: '48px' }}>
                  <div style={{ maxWidth: '80%', width: 'fit-content' }}>
                    <div
                      className="px-3 py-2"
                      style={{
                        backgroundColor: '#d9fdd3',
                        borderRadius: '8px 8px 2px 8px',
                        fontSize: '0.85rem',
                        color: '#1a1f36',
                        lineHeight: '1.5',
                        wordBreak: 'break-word',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                      }}
                    >
                      {comment.content}
                    </div>
                    <div className="d-flex justify-content-end mt-1" style={{ paddingRight: '4px' }}>
                      <span
                        className="text-secondary"
                        style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                        title={formatFullDate(comment.createdAt)}
                      >
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={comment.id} style={{ paddingRight: '48px' }}>
                <div style={{ maxWidth: '80%', width: 'fit-content' }}>
                  <div
                    className="px-3 py-2"
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '8px 8px 8px 2px',
                      fontSize: '0.85rem',
                      color: '#1a1f36',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                    }}
                  >
                    {comment.content}
                  </div>
                  <div className="mt-1" style={{ paddingLeft: '4px' }}>
                    <span
                      className="text-secondary"
                      style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                      title={formatFullDate(comment.createdAt)}
                    >
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Input ── */}
      {isResolved ? (
        <div className="px-3 py-2 flex-shrink-0 text-center" style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
          <p className="text-secondary fst-italic mb-0" style={{ fontSize: '0.8rem' }}>
            This complaint is resolved. Comments are closed.
          </p>
        </div>
      ) : (
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f8f9fb' }}>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control shadow-none"
              placeholder="Type a message..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              maxLength={1000}
              style={{
                borderRadius: '24px',
                fontSize: '0.85rem',
                height: '42px',
                paddingLeft: '16px',
              }}
            />
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
              onClick={handleAdd}
              disabled={submitting || !newComment.trim()}
              style={{
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                padding: 0,
              }}
            >
              {submitting ? (
                <span className="spinner-border spinner-border-sm" style={{ width: '16px', height: '16px' }} />
              ) : (
                <i className="bi bi-send-fill" style={{ fontSize: '1rem' }} />
              )}
            </button>
          </div>
          <div className="d-flex justify-content-end mt-1">
            <span
              className="text-secondary"
              style={{
                fontSize: '0.68rem',
                opacity: newComment.length > 900 ? 1 : 0.5,
                color: newComment.length >= 1000 ? '#dc2626' : undefined,
              }}
            >
              {newComment.length}/1000
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintComments;
