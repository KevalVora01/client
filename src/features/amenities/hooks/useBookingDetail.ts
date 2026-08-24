import { useState, useEffect, useCallback, useReducer } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { BookingDetail, VoteChoice } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError, showSuccess } from '../../../utils/toast';
import useAuth from '../../../hooks/useAuth';

type DraftAction =
  | { type: 'TOGGLE'; memberId: number; vote: VoteChoice }
  | { type: 'INIT'; votes: Record<number, VoteChoice> }
  | { type: 'RESET' };

function draftReducer(state: Record<number, VoteChoice>, action: DraftAction) {
  switch (action.type) {
    case 'TOGGLE':
      if (state[action.memberId] === action.vote) {
        const next = { ...state };
        delete next[action.memberId];
        return next;
      }
      return { ...state, [action.memberId]: action.vote };
    case 'INIT':
      return action.votes;
    case 'RESET':
      return {};
    default:
      return state;
  }
}

export const useBookingDetail = (id: number) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [draftVotes, dispatch] = useReducer(draftReducer, {});
  const [draftAdminVote, setDraftAdminVote] = useState<VoteChoice | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookingApi.getDetail(id);
      setData(result);

      const draft: Record<number, VoteChoice> = {};
      let admin: VoteChoice | null = null;
      for (const v of result.votes || []) {
        if (v.committeeMemberId != null) {
          draft[v.committeeMemberId] = v.vote;
        } else {
          admin = v.vote;
        }
      }
      dispatch({ type: 'INIT', votes: draft });
      setDraftAdminVote(admin);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load booking'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await bookingApi.getDetail(id);
        if (!cancelled) {
          setData(result);

          const draft: Record<number, VoteChoice> = {};
          let admin: VoteChoice | null = null;
          for (const v of result.votes || []) {
            if (v.committeeMemberId != null) {
              draft[v.committeeMemberId] = v.vote;
            } else {
              admin = v.vote;
            }
          }
          dispatch({ type: 'INIT', votes: draft });
          setDraftAdminVote(admin);
        }
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load booking'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const setMemberVote = useCallback((committeeMemberId: number, vote: VoteChoice) => {
    dispatch({ type: 'TOGGLE', memberId: committeeMemberId, vote });
  }, []);

  const setAdminVote = useCallback((vote: VoteChoice) => {
    setDraftAdminVote((prev) => (prev === vote ? null : vote));
  }, []);

  const finalize = useCallback(async () => {
    setActionLoading(true);
    try {
      if (!data) return false;

      const votes = (data.committeeMembers || [])
        .filter((m) => draftVotes[m.id] != null)
        .map((m) => ({ committeeMemberId: m.id, vote: draftVotes[m.id] as VoteChoice }));

      await bookingApi.bulkRecordVotes(id, votes, draftAdminVote ?? undefined);
      const result = await bookingApi.finalizeBooking(id);
      showSuccess(result.status === 'Confirmed' ? 'Booking approved by voting' : 'Booking rejected by voting');
      await fetchDetail();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to finalize booking'));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [id, data, draftVotes, draftAdminVote, fetchDetail]);

  const recordVotes = useCallback(async () => {
    setActionLoading(true);
    try {
      if (!data) return false;

      const votes = (data.committeeMembers || [])
        .filter((m) => draftVotes[m.id] != null)
        .map((m) => ({ committeeMemberId: m.id, vote: draftVotes[m.id] as VoteChoice }));

      await bookingApi.bulkRecordVotes(id, votes, draftAdminVote ?? undefined);
      showSuccess('Votes recorded successfully');
      await fetchDetail();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to record votes'));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [id, data, draftVotes, draftAdminVote, fetchDetail]);

  return {
    booking: data,
    data,
    loading,
    actionLoading,
    draftVotes,
    draftAdminVote,
    setMemberVote,
    setAdminVote,
    finalize,
    recordVotes,
    refetch: fetchDetail,
    isAdmin,
  };
};
