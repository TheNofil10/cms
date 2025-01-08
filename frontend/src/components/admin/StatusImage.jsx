const StatusImage = ({ status, className }) => {
    const getImagePath = () => {
      // if (status === "pending") return "../../pending.png";
      // if (status === "approved") return "../../approved.png";
      // if (status === "rejected") return "../../rejected.png";

      if (status === "pending") return "#FFBF00";
      if (status === "approved") return "green";
      if (status === "rejected") return "red";
    }

    return (
      // <img className={className} style={{ width:width }} src={getImagePath()} alt={status}/>
      <p className={className} style={{ color:getImagePath() }}>{status.toUpperCase()}</p>
    )
  }

export default StatusImage;
