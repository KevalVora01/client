import { useState, useEffect } from 'react';
import { complaintApi } from '../api/complaintApi';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

interface Comment {
  id: number;
  complaintId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: { id: number; name: string } | null;
}

interface ComplaintDetailModalProps {
  complaint: Complaint;
  isAdmin: boolean;
  onClose: () => void;
  onAddComment: (id: number, content: string) => Promise<boolean>;
  onUpdateStatus: (complaint: Complaint, status: ComplaintStatus) => Promise<void>;
  onRefetch: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const ComplaintDetailModal = ({
  complaint,
  isAdmin,
  onClose,
  onAddComment,
  onUpdateStatus,
  onRefetch,
}: ComplaintDetailModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isResolved = complaint.status === 'Resolved';

  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const data = await complaintApi.getComments(complaint.id);
        if (!cancelled) setComments(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load comments'));
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    };

    fetchComments();
    return () => { cancelled = true; };
  }, [complaint.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    const success = await onAddComment(complaint.id, newComment.trim());
    if (success) {
      setNewComment('');
      const data = await complaintApi.getComments(complaint.id);
      setComments(data);
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (status: ComplaintStatus) => {
    await onUpdateStatus(complaint, status);
    onRefetch();
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* Header */}
          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                {complaint.title}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                Raised on {formatDate(complaint.createdAt)}
              </p>
            </div>
            <button
              className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
              onClick={onClose}
              aria-label="Close"
              style={{ width: '30px', height: '30px', top: '1.2rem', right: '1.2rem' }}
            >
              <i className="bi bi-x fs-5" />
            </button>
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

            {/* Status + Priority row */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="badge fw-medium"
                style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#4b5563' }}
              >
                Priority: {complaint.priority}
              </span>

              {isAdmin && !isResolved ? (
                <select
                  className="form-select form-select-sm shadow-none"
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(e.target.value as ComplaintStatus)}
                  style={{ fontSize: '0.8rem', borderRadius: '8px', width: 'auto' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              ) : (
                <span
                  className="badge fw-medium"
                  style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', backgroundColor: '#d1fae5', color: '#065f46' }}
                >
                  {complaint.status}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mb-3" style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {complaint.description}
            </p>

            {/* Images gallery */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mb-4">
                {complaint.images.map((img) => (
                  <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.imageUrl}
                      alt="Complaint attachment"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                  </a>
                ))}
              </div>
            )}

            <hr className="my-4" />

            {/* Comments */}
            <h6 className="fw-semibold mb-3" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>
              Comments
            </h6>

            {loadingComments ? (
              <div className="d-flex flex-column gap-2 mb-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>No comments yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2 mb-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-2 px-3 rounded-3"
                    style={{ backgroundColor: '#f9fafb', fontSize: '0.85rem' }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium" style={{ color: '#1a1f36' }}>
                        {comment.user?.name ?? 'User'}
                      </span>
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mb-0" style={{ color: '#374151' }}>{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            {isResolved ? (
              <p className="text-secondary fst-italic" style={{ fontSize: '0.82rem' }}>
                This complaint is resolved. Comments are closed.
              </p>
            ) : (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control shadow-none"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  maxLength={1000}
                  style={{ borderRadius: '8px', fontSize: '0.85rem' }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  style={{ borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  {submitting ? '...' : 'Post'}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;