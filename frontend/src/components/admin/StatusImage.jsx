const StatusImage = ({ status, width, className }) => {
    const getImagePath = () => {
      if (status === "pending") return "../../pending.png";
      if (status === "approved") return "../../approved.png";
      if (status === "rejected") return "../../rejected.png";
    }

    return (
      <img className={className} style={{ width:width }} src={getImagePath()} alt={status}/>
    )
  }

export default StatusImage;
