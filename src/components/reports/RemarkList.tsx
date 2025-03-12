
import { Remark } from "@/utils/reportUtils";
import { formatDistanceToNow } from "date-fns";

interface RemarkListProps {
  remarks: Remark[];
}

const RemarkList = ({ remarks }: RemarkListProps) => {
  if (!remarks || remarks.length === 0) {
    return <p className="text-gray-500 italic">No remarks added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {remarks.map((remark) => (
        <div 
          key={remark.id} 
          className="p-4 bg-gray-50 border border-gray-100 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{remark.addedBy}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(remark.dateAdded, { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{remark.text}</p>
        </div>
      ))}
    </div>
  );
};

export default RemarkList;
