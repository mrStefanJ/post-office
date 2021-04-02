import React, { useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { useStores } from "../../common/useStores";
import { LoaderContext } from "../../common/LoaderContext";
import { ToastContext } from "../../common/ToastContext";
import { deletePostOfficeAPI } from "../PostOfficeAPI";

export const DeletePostOfficeDialog = (props: {
  data: { postOfficeId: string; rowIndex: number };
}) => {
  // You can use Hooks here!
  const [open, setOpen] = useState(false);

  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { postOfficeTableStore } = useStores();
  const showLoader = useContext(LoaderContext);
  const showToast = useContext(ToastContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickYes = () => {
    showLoader(true);

    deletePostOfficeAPI(props.data.postOfficeId)
      .then((response) => {
        showLoader(false);

        if (response.statusText.toLowerCase() === "ok") {
          handleClose();

          showToast(response.data);

          postOfficeTableStore.deletePostOffice(props.data.rowIndex);
        }
      })
      .catch(() => {
        showLoader(false);
        showToast("Greška prilikom brisanja pošte.");
      });
  };

  return (
    <>
      {/*
      Icon Button with Tooltip
      https://material-ui.com/components/buttons/#icon-buttons
      https://material-ui.com/components/tooltips/#simple-tooltips
      */}
      <Tooltip title="Brisanje pošte" aria-label="Brisanje pošte">
        <IconButton aria-label="delete" onClick={handleClickOpen}>
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-post-office-dialog-title"
        aria-describedby="delete-post-office-dialog-description"
      >
        <DialogTitle id="delete-post-office-dialog-title">
          Brisanje pošte
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-post-office-dialog-description">
            Jeste li sigurni da želite da izbrišete ovu poštu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ne
          </Button>
          <Button onClick={handleClickYes} color="primary" autoFocus>
            Da
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
