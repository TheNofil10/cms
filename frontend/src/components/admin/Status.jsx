const Status = ({ status, className }) => {
    const getImagePath = () => {
      // if (status === "pending") return "#FFBF00";
      // if (status === "approved") return "green";
      if (status === "rejected") return "red";
      else return "green"
    }

    return (
      // <img className={className} style={{ width:width }} src={getImagePath()} alt={status}/>
      <p className={className} style={{ color:getImagePath() }}>{status.toUpperCase()}</p>
    )
  }

export default Status;
