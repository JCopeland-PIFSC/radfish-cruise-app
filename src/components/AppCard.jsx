const AppCard = ({ children, className }) => {
  return (
    <div className={`1border padding-1 margin-y-2 radius-lg app-card ${className || ""}`}>
      {children}
    </div>
  );
}

export default AppCard;
