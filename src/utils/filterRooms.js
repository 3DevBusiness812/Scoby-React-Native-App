export const filterRooms = (rooms, filter) =>
  rooms?.filter(
    ({participantUsers}) =>
      participantUsers[0]?.fullName.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      participantUsers[0]?.username.toLowerCase().indexOf(filter.toLowerCase()) > -1,
  );
