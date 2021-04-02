import React, { useState } from "react";

import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type { PostOffice } from "../PostOfficeModel";
import { useStores } from "../../common/useStores";
import { PostOfficeForm } from "../PostOfficeForm";

export const CreateUpdatePostOfficeDialog = (props: {
  operation: "create" | "update";
  data?: { postOffice: PostOffice; rowIndex: number };
}) => {
  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { postOfficeTableStore } = useStores();

  // You can use Hooks here!
  const [open, setOpen] = useState<boolean>(false);

  const handleOnDialogEnter = () => {
    if (props.data) postOfficeTableStore.selectedRow = props.data;
    else postOfficeTableStore.selectedRow = null;
  };

  const handleOnDialogExited = () => (postOfficeTableStore.selectedRow = null);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      {/*
      Icon Button / Fab with Icon with Tooltip
      https://material-ui.com/components/buttons/#icon-buttons
      https://material-ui.com/components/tooltips/#simple-tooltips
      https://material-ui.com/components/tooltips/#positioned-tooltips
      */}
      <Tooltip
        placement={props.operation === "create" ? "right" : "bottom"}
        title={
          props.operation === "create"
            ? "Dodavanje nove pošte"
            : "Ažuriranje pošte"
        }
        aria-label={
          props.operation === "create"
            ? "Dodavanje nove pošte"
            : "Ažuriranje pošte"
        }
      >
        {props.operation === "create" ? (
          <Fab color="primary" onClick={handleClickOpen}>
            <PlaylistAddIcon />
          </Fab>
        ) : (
          <IconButton aria-label="edit" onClick={handleClickOpen}>
            <EditIcon />
          </IconButton>
        )}
      </Tooltip>
      <Dialog
        open={open}
        onEnter={handleOnDialogEnter}
        onClose={handleClose}
        onExited={handleOnDialogExited}
        aria-labelledby="create-update-post-office-dialog-title"
      >
        <DialogTitle id="create-update-post-office-dialog-title">
          {props.operation === "create"
            ? "Dodavanje nove pošte"
            : "Ažuriranje pošte"}
        </DialogTitle>
        <DialogContent>
          <PostOfficeForm closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
