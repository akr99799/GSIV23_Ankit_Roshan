import { ReactComponent as SearchIcon } from "../../../assets/search_FILL0_wght300_GRAD200_opsz24.svg";
import { InputProps } from "../../../types/webComponentTypes";

interface Props {
  inputProps?: InputProps;
}

export default function SearchBar({ inputProps }: Props) {
  return (
    <div
      className={`flex items-center w-full sm:w-3/4 md:2/4  p-1 rounded-lg gap-2 ${
        inputProps?.disabled ? "bg-[#DFDFDF]" : "bg-[#cacaca]"
      }`}
    >
      <label htmlFor="search-bar">
        <SearchIcon />
      </label>
      <input
        aria-label="search-input"
        placeholder="Search"
        {...inputProps}
        id="search-bar"
        className="w-full h-8 p-2 outline-none bg-transparent placeholder:text-[#5e5e5e]"
      />
    </div>
  );
}
