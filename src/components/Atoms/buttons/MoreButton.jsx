import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fonts } from "@/fonts/fonts";
import { MoreVertical, Trash, Pencil } from "lucide-react";
import { useState } from "react";
import UpdateWatchlistButton from "./UpdateWatchlistButton";

const MoreButton = ({
  watchlistData,
  onClickDelete,
  isDeletingWatchlistPending,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="h-8 w-8 rounded-full hover:bg-[#2A2A2A] flex items-center justify-center"
          >
            <MoreVertical size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-fit bg-[#1A1A1A] p-2 flex flex-col gap-1"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateWatchlistButton
              watchlistData={watchlistData}
              onClosePopover={() => setOpenPopover(false)}
            />
          </div>

          <Button
            variant="ghost"
            className={`${fonts.satoshi.className} text-red-500 font-semibold hover:bg-[#2A2A2A] hover:text-red-400 w-full justify-start items-center gap-2`}
            onClick={(e) => {
              e.stopPropagation();
              setOpenPopover(false);
              setOpenDialog(true);
            }}
          >
            <Trash size={16} />
            Delete
          </Button>
        </PopoverContent>
      </Popover>

      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
        }}
      >
        <DialogContent
          className="max-w-sm"
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.stopPropagation()}
        >
          <DialogTitle>Anda yakin ingin menghapus?</DialogTitle>

          <DialogFooter className="flex flex-col gap-2 pt-4 w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClickDelete(e);
                setOpenDialog(false);
              }}
              className="w-fit bg-red-600 hover:bg-red-600/80"
              disabled={isDeletingWatchlistPending}
            >
              {isDeletingWatchlistPending ? "Menghapus..." : "Hapus"}
            </Button>

            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(false);
              }}
              className="hover:bg-[#2F2F2F]"
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoreButton;
