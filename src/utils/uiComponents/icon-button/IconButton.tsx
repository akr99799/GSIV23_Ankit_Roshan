import { SVGComponent } from "../../../types/webComponentTypes";

interface Props {
  icon: SVGComponent;
  onClick: () => void;
}

export default function IconButton({ icon, onClick }: Props) {
  const Icon = icon;
  return (
    <div
      role="button"
      aria-label="Icon button"
      onClick={onClick}
      className="hover:bg-gray-200 hover:rounded-2xl hover:cursor-pointer w-8 h-8 flex items-center justify-center"
    >
      <Icon />
    </div>
  );
}
