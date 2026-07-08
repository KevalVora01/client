import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintApi } from '../api/complaintApi';
import { useComplaintMutations } from '../hooks/useComplaintMutations';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants/complaintStyles';
import useAuth from '../../../hooks/useAuth';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';

interface Comment {
  id: number;
  complaintId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: { id: number; name: string } | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const ComplaintDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { updateStatus, addComment, loading: mutationLoading } = useComplaintMutations();

  const fetchComplaint = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await complaintApi.getComplaint(Number(id));
      setComplaint(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load complaint'));
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const data = await complaintApi.getComments(Number(id));
      setComments(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load comments'));
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplaint();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status: ComplaintStatus) => {
    if (!complaint) return;
    const success = await updateStatus(complaint.id, { status });
    if (success) fetchComplaint();
  };

  const handleAddComment = async () => {
    if (!complaint || !newComment.trim()) return;
    const success = await addComment(complaint.id, newComment.trim());
    if (success) {
      setNewComment('');
      fetchComments();
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-column gap-3">
          <div className="skeleton" style={{ width: '160px', height: '20px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '50%', height: '28px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '100%', height: '140px', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container-fluid p-3 p-md-4 text-center py-5">
        <p className="text-secondary">Complaint not found.</p>
      </div>
    );
  }

  const isResolved = complaint.status === 'Resolved';
  const statusCfg = STATUS_CONFIG[complaint.status];
  const priorityCfg = PRIORITY_CONFIG[complaint.priority];

  return (
    <div className="container-fluid p-3 p-md-4 max-w-100 mx-auto" style={{ maxWidth: '760px' }}>

      {/* Back link */}
      <button
        className="btn btn-link p-0 d-flex align-items-center gap-2 mb-4 text-secondary text-decoration-none"
        onClick={() => navigate(-1)}
        style={{ fontSize: '0.85rem' }}
      >
        <i className="bi bi-arrow-left" />
        Back to complaints
      </button>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span
              className="d-inline-flex align-items-center gap-1 fw-medium"
              style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px' }}
            >
              <i className={`bi ${statusCfg.icon}`} style={{ fontSize: '0.7rem' }} />
              {complaint.status}
            </span>
            <span
              className="fw-medium"
              style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.color, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px' }}
            >
              {complaint.priority} priority
            </span>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: '#1a1f36' }}>{complaint.title}</h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
            Complaint #{complaint.id} &middot; Raised on {formatDate(complaint.createdAt)}
          </p>
        </div>

        {isAdmin && !isResolved && (
          <select
            className="form-select shadow-none"
            value={complaint.status}
            onChange={(e) => handleStatusChange(e.target.value as ComplaintStatus)}
            disabled={mutationLoading}
            style={{ width: '160px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        )}
      </div>

      {/* Description card */}
      <div className="rounded-3 p-4 mb-4" style={{ backgroundColor: '#f9fafb' }}>
        <p className="fw-medium text-secondary mb-2" style={{ fontSize: '0.8rem' }}>Description</p>
        <p className="mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-line' }}>
          {complaint.description}
        </p>

        {complaint.resident && (
          <div className="d-flex align-items-center gap-2 text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-person" />
            Apartment {complaint.resident.apartmentId}
          </div>
        )}

        {complaint.images && complaint.images.length > 0 && (
          <>
            <p className="fw-medium text-secondary mb-2" style={{ fontSize: '0.8rem' }}>Attached photos</p>
            <div className="d-flex gap-2 flex-wrap">
              {complaint.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img.imageUrl)}
                  style={{
                    width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden',
                    border: '0.5px solid #e5e7eb', cursor: 'pointer',
                  }}
                >
                  <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Comments */}
      <h6 className="fw-semibold mb-3" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>Comments</h6>

      {loadingComments ? (
        <div className="d-flex flex-column gap-2 mb-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>No comments yet.</p>
      ) : (
        <div className="d-flex flex-column gap-2 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-3 p-3" style={{ backgroundColor: '#f9fafb' }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-medium" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
                  {comment.user?.name ?? 'User'}
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{formatDate(comment.createdAt)}</span>
              </div>
              <p className="mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#374151' }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {isResolved ? (
        <p className="text-secondary fst-italic" style={{ fontSize: '0.82rem' }}>
          This complaint is resolved. Comments are closed.
        </p>
      ) : (
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            maxLength={1000}
            style={{ borderRadius: '8px', fontSize: '0.85rem' }}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={mutationLoading || !newComment.trim()}
            style={{ borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {mutationLoading ? '...' : 'Post'}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1050 }}
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
        </div>
      )}

    </div>
  );
};

export default ComplaintDetailPage;