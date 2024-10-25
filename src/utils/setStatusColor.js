export const setStatusColor = (statusId) => {
  if (!statusId) return "";
  const statusIdStr = statusId.toString();
  switch (statusIdStr) {
    case "1":
      // Started
      return "bg-blue text-white";
    case "2":
      // Ended
      return "bg-mint";
    case "3":
      // Submitted
      return "bg-gold";
    case "4":
      // Rejected
      return "bg-red text-white";
    case "5":
      // Accepted
      return "bg-green text-white";
    default:
      return "";
  }
};
