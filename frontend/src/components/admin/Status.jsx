const Status = ({ status, className }) => {
    const getImagePath = () => {
      if (status === "ready for collection") return "green";
      if (status === "rejected") return "red";
      else return "#FFBF00"
    }

    return (
      // <img className={className} style={{ width:width }} src={getImagePath()} alt={status}/>
      <p className={className} style={{ color:getImagePath() }}>{status.toUpperCase()}</p>
    )
  }

export default Status;
