const DashboardCard = ({ title, count, color }) => {
  return (
    <div className={`p-8 shadow-xl rounded-xl text-white ${color} flex flex-col items-center justify-center`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold">{count}</p>
    </div>
  );
};

export default DashboardCard;
