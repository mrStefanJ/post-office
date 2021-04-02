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
import type { Shipment } from "../ShipmentTableModel";
import { useStores } from "../../common/useStores";
import { ShipmentForm } from "../ShipmentForm";

export const CreateUpdateShipmentDialog = (props: {
  operation: "create" | "update";
  data?: { shipment: Shipment; rowIndex: number };
}) => {
  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { shipmentTableStore } = useStores();

  // You can use Hooks here!
  const [open, setOpen] = useState<boolean>(false);

  const handleOnDialogEnter = () => {
    if (props.data) shipmentTableStore.selectedRow = props.data;
    else shipmentTableStore.selectedRow = null;
  };

  const handleOnDialogExited = () => (shipmentTableStore.selectedRow = null);

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
            ? "Dodavanje nove pošiljke"
            : "Ažuriranje pošiljke"
        }
        aria-label={
          props.operation === "create"
            ? "Dodavanje nove pošiljke"
            : "Ažuriranje pošiljke"
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
        aria-labelledby="create-update-shipment-dialog-title"
      >
        <DialogTitle id="create-update-shipment-dialog-title">
          {props.operation === "create"
            ? "Dodavanje nove pošiljke"
            : "Ažuriranje pošiljke"}
        </DialogTitle>
        <DialogContent>
          <ShipmentForm closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
