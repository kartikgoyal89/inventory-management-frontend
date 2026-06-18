import { Inbox } from "lucide-react";

const EmptyState = ({ title = "Nothing here yet", message }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
    <Inbox className="h-10 w-10 text-gray-300" />
    <p className="text-sm font-medium text-gray-700">{title}</p>
    {message && <p className="text-sm text-gray-500">{message}</p>}
  </div>
);

export default EmptyState;
