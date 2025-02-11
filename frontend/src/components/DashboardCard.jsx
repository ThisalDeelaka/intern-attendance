const DashboardCard = ({ title, count, color, icon }) => {
  return (
    <div
      className={`relative flex items-center p-6 shadow-md rounded-2xl text-white ${color} 
      hover:shadow-lg transition-transform duration-300`}
    >
      {/* Icon with Background */}
      <div className="bg-white p-3 rounded-full shadow-md">
        {icon}
      </div>
      
      {/* Text Section */}
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-5xl font-extrabold">{count}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
