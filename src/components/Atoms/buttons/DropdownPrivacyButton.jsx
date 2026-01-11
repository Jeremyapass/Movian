import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownPrivacyButton = ({ value, onChange, disabled = false }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="
            w-fit bg-[#111111] hover:bg-[#181818] active:bg-[#1F1F1F]
            border border-white/5 hover:border-white/10
          "
          disabled={disabled}
        >
          {value ?? "Pilih Privasi"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[160px]">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onChange("Public")}>
            Public
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange("Private")}>
            Private
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownPrivacyButton;
