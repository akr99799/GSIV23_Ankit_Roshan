import { ReactNode } from "react";
import { DivMouseEvent } from "../../../types/eventTypes";
import { ImageProps } from "../../../types/webComponentTypes";

interface Props {
  imgUrl: string;
  imgProps?: ImageProps;
  title: ReactNode | string;
  description?: ReactNode | string;
  button?: boolean;
  onClick?: (event?: DivMouseEvent) => void;
}

export default function Card({ imgUrl, imgProps, title, description, button, onClick }: Props) {
  return (
    <div
      role={button ? "button" : ""}
      className={`w-56 h-72 border shadow-lg rounded-lg flex-col ${
        button && "hover:cursor-pointer hover:opacity-80"
      }`}
      onClick={onClick}
    >
      <div className="flex-1">
        <img {...imgProps} className="w-56 h-48 object-cover" src={imgUrl} alt={imgProps?.alt} />
      </div>
      <div className="px-2 flex flex-col gap-2">
        {typeof title !== "string" ? <>{title}</> : <p className="font-bold">{title}</p>}
        {typeof description !== "string" ? (
          <>{description}</>
        ) : (
          <p className="font-light line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}
