import ExpandableSection from "@/app/components/ExpandableSection";

type SectionBlockProps = {
  title: string;
  items: { title: string; content: string }[];
};

export default function SectionBlock({ title, items }: SectionBlockProps) {
  return (
    <div className="bg-white mt-12 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <ExpandableSection
            key={index}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
}
