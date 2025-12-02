import { Book, Disc } from "./icons";
import { Chevron } from "./icons";

const BreadCrumb = ({ category, title }) => {
  return (
    <div className="mt-6 mb-10 flex items-center gap-x-2">
      <Disc width={14} height={14} className="mr-1 inline-block" />
      <Book width={16} height={16} className="mr-1 inline-block" />
      <span className="text-sm font-medium text-black">{category}</span>
      <Chevron width={14} height={14} className="inline-block -rotate-90" />
      <span className="text-sm text-[#0040C1] underline underline-offset-4">{title}</span>
    </div>
  );
};

export default BreadCrumb;