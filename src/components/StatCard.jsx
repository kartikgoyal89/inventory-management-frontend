import Card from "./Card";

const colors = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

const StatCard = ({ label, value, icon: Icon, color = "indigo" }) => (
  <Card className="flex items-center gap-4">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colors[color]}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  </Card>
);

export default StatCard;
