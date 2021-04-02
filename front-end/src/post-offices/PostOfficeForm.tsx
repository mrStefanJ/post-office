import React, { useContext, useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { useStores } from "../common/useStores";
import { LoaderContext } from "../common/LoaderContext";
import { ToastContext } from "../common/ToastContext";
import {
  createPostOfficeAPI,
  readPostOfficesAPI,
  updatePostOfficeAPI,
} from "./PostOfficeAPI";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formGroupRow: {
      marginBottom: theme.spacing(2),
    },
    formActions: {
      float: "right",
    },
  })
);

export const PostOfficeForm = (props: { closeDialog: () => void }) => {
  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { postOfficeTableStore } = useStores();
  const showLoader = useContext(LoaderContext);
  const showToast = useContext(ToastContext);

  // You can use Hooks here!
  const classes = useStyles();
  const [operation, setOperation] = useState<"create" | "update">("create");

  /*
  useForm errors, handleSubmit, setValue, control and formState methods:
  https://react-hook-form.com/api#errors
  https://react-hook-form.com/api#handleSubmit
  https://react-hook-form.com/api#setValue
  https://react-hook-form.com/api#control
  https://react-hook-form.com/api#formState

  Validation will trigger on the change event with each input and lead to multiple re-renders.
  WARNING: This often comes with a significant impact on performances.
  (docs: https://react-hook-form.com/api#useForm)
  */
  const { errors, handleSubmit, setValue, control, formState } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (postOfficeTableStore.selectedRow) {
      setOperation("update");

      // Don't forget to set shouldValidate parameter as true, because without it, form will be invalid after data is initialized
      setValue(
        [
          { PLZ: postOfficeTableStore.selectedRow.postOffice.PLZ },
          { name: postOfficeTableStore.selectedRow.postOffice.name },
        ],
        true
      );
    }
  }, [postOfficeTableStore.selectedRow, setValue]);

  const onSubmit = handleSubmit((data) => {
    if (data) {
      if (
        operation === "update" &&
        postOfficeTableStore.selectedRow?.postOffice.id
      ) {
        showLoader(true);

        updatePostOfficeAPI({
          id: postOfficeTableStore.selectedRow.postOffice.id,
          PLZ: Number.parseInt(data.PLZ),
          name: data.name,
        })
          .then((response) => {
            showLoader(false);

            if (response.statusText.toLowerCase() === "ok") {
              props.closeDialog();

              showToast(response.data);

              if (postOfficeTableStore.selectedRow) {
                postOfficeTableStore.updatePostOffice(
                  {
                    id: postOfficeTableStore.selectedRow.postOffice.id,
                    PLZ: Number.parseInt(data.PLZ),
                    name: data.name,
                  },
                  postOfficeTableStore.selectedRow.rowIndex
                );
              }
            }
          })
          .catch(() => {
            showLoader(false);
            showToast("Greška prilikom ažuriranja pošte.");
          });
      } else {
        showLoader(true);

        createPostOfficeAPI({
          PLZ: Number.parseInt(data.PLZ),
          name: data.name,
        })
          .then((response) => {
            showLoader(false);

            if (response.statusText.toLowerCase() === "ok") {
              props.closeDialog();

              showToast(response.data);

              showLoader(true);

              readPostOfficesAPI()
                .then((response) => {
                  showLoader(false);

                  if (response.statusText.toLowerCase() === "ok")
                    postOfficeTableStore.setPostOffices(response.data);
                })
                .catch(() => {
                  showLoader(false);
                  showToast("Greška prilikom učitavanja pošti.");
                });
            }
          })
          .catch(() => {
            showLoader(false);
            showToast("Greška prilikom dodavanja nove pošte.");
          });
      }
    }
  });

  /* Read the formState before render (docs: https://react-hook-form.com/api#formState) */
  const { dirty, isValid } = formState;

  return (
    <form onSubmit={onSubmit}>
      <FormGroup row className={classes.formGroupRow}>
        <Controller
          as={
            <TextField
              error={Boolean(errors.PLZ)}
              label="Poštanski broj"
              type="number"
              InputLabelProps={{ shrink: true }}
              helperText={
                errors.PLZ && "Poštanski broj je obavezan i mora biti > 0"
              }
              variant="outlined"
            />
          }
          control={control}
          rules={{ required: true, min: 1 }}
          name="PLZ"
          defaultValue={""}
        />
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <Controller
          as={
            <TextField
              error={Boolean(errors.name)}
              label="Naziv pošte"
              InputLabelProps={{ shrink: true }}
              helperText={errors.name && "Naziv pošte je obavezan"}
              variant="outlined"
            />
          }
          control={control}
          rules={{ required: true }}
          name="name"
          defaultValue={""}
        />
      </FormGroup>
      <div className={classes.formActions}>
        <Button color="primary" onClick={props.closeDialog}>
          Otkaži
        </Button>
        <Button type="submit" color="primary" disabled={!(dirty && isValid)}>
          Sačuvaj
        </Button>
      </div>
    </form>
  );
};
