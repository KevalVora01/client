import useAuth from "../../../hooks/useAuth";

const useMyResident = (enabled: boolean = true) => {
  const { user } = useAuth();

  if (!enabled || !user) {
    return {
      resident: null,
      loading: false,
      error: null,
      isOwner: false,
      isOccupant: false,
      isActiveResident: false,
      isCurrentOccupant: false,
      canRaiseComplaint: false,
      canPayMaintenance: false,
      refetch: () => Promise.resolve(),
    };
  }

  const residentSummary = user.resident ?? null;
  const isOwner = residentSummary?.isOwner ?? false;
  const isOccupant = residentSummary?.isOccupant ?? false;
  const isActiveResident = user.isActive;
  const isCurrentOccupant = isActiveResident && isOccupant;

  return {
    resident: residentSummary,
    loading: false,
    error: null,
    isOwner,
    isOccupant,
    isActiveResident,
    isCurrentOccupant,
    canRaiseComplaint: isCurrentOccupant,
    canPayMaintenance: isCurrentOccupant,
    canBookAmenity: isCurrentOccupant,
    refetch: () => Promise.resolve(),
  };
};

export default useMyResident;
