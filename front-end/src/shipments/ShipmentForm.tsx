import React, { useContext, useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { useStores } from "../common/useStores";
import { LoaderContext } from "../common/LoaderContext";
import { ToastContext } from "../common/ToastContext";
import {
  createShipmentAPI,
  readShipmentsAPI,
  updateShipmentAPI,
} from "./ShipmentAPI";
import { CreateShipmentRequest } from "./ShipmentTableModel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formGroupRow: {
      marginBottom: theme.spacing(1),
    },
    formControl: {
      minWidth: 150,
    },
    formActions: {
      float: "right",
    },
  })
);

export const ShipmentForm = (props: { closeDialog: () => void }) => {
  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { shipmentTableStore, postOfficeTableStore } = useStores();
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
    if (shipmentTableStore.selectedRow) {
      setOperation("update");

      // Don't forget to set shouldValidate parameter as true, because without it, form will be invalid after data is initialized
      setValue(
        [
          { type: shipmentTableStore.selectedRow.shipment.type.id },
          { origin: shipmentTableStore.selectedRow.shipment.origin },
          { destination: shipmentTableStore.selectedRow.shipment.destination },
          { delivered: shipmentTableStore.selectedRow.shipment.delivered },
          { weight: shipmentTableStore.selectedRow.shipment.weight.id },
          { office: shipmentTableStore.selectedRow.shipment.office.id },
        ],
        true
      );
    }
  }, [shipmentTableStore.selectedRow, setValue]);

  const onSubmit = handleSubmit((data) => {
    if (data) {
      if (
        operation === "update" &&
        shipmentTableStore.selectedRow?.shipment.id
      ) {
        const selectedType = shipmentTableStore.types.find(
          (element) => element.id === data.type
        );
        const selectedWeight = shipmentTableStore.weights.find(
          (element) => element.id === data.weight
        );
        const selectedPostOffice = postOfficeTableStore.rows.find(
          (element) => element.id === data.office
        );

        if (selectedType && selectedWeight && selectedPostOffice) {
          showLoader(true);

          updateShipmentAPI({
            id: shipmentTableStore.selectedRow.shipment.id,
            type: selectedType,
            origin: data.origin,
            destination: data.destination,
            delivered: data.delivered,
            weight: selectedWeight,
            office: selectedPostOffice,
          })
            .then((response) => {
              showLoader(false);

              if (response.statusText.toLowerCase() === "ok") {
                props.closeDialog();

                showToast(response.data);

                if (shipmentTableStore.selectedRow) {
                  shipmentTableStore.updateShipment(
                    {
                      id: shipmentTableStore.selectedRow.shipment.id,
                      type: selectedType,
                      origin: data.origin,
                      destination: data.destination,
                      delivered: data.delivered,
                      weight: selectedWeight,
                      office: selectedPostOffice,
                    },
                    shipmentTableStore.selectedRow.rowIndex
                  );
                }
              }
            })
            .catch(() => {
              showLoader(false);
              showToast("Greška prilikom ažuriranja pošiljke.");
            });
        }
      } else {
        showLoader(true);

        createShipmentAPI(data as CreateShipmentRequest)
          .then((response) => {
            showLoader(false);

            if (response.statusText.toLowerCase() === "ok") {
              props.closeDialog();

              showToast(response.data);

              showLoader(true);

              readShipmentsAPI()
                .then((response) => {
                  showLoader(false);

                  if (response.statusText.toLowerCase() === "ok")
                    shipmentTableStore.setShipments(response.data);
                })
                .catch(() => {
                  showLoader(false);
                  showToast("Greška prilikom učitavanja pošiljki.");
                });
            }
          })
          .catch(() => {
            showLoader(false);
            showToast("Greška prilikom dodavanja nove pošiljke.");
          });
      }
    }
  });

  /* Read the formState before render (docs: https://react-hook-form.com/api#formState) */
  const { dirty, isValid } = formState;

  return (
    <form onSubmit={onSubmit}>
      <FormGroup row className={classes.formGroupRow}>
        <FormControl
          className={classes.formControl}
          error={Boolean(errors.type)}
          required
        >
          <InputLabel id="type-select-label">Vrsta pošiljke</InputLabel>
          {/* Properties of the Controller (docs: https://react-hook-form.com/api#Controller) */}
          <Controller
            as={
              <Select labelId="type-select-label">
                <MenuItem value="">
                  <em>--</em>
                </MenuItem>
                {shipmentTableStore.types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            }
            name="type"
            control={control}
            rules={{ required: true }}
            defaultValue={""}
          />
          <FormHelperText>
            {/*
            React Hook Form provides an errors object to show you the errors in the form
            (docs: https://react-hook-form.com/get-started#Handleerrors)
            */}
            {errors.type && "Vrsta pošiljke je obavezna"}
          </FormHelperText>
        </FormControl>
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <FormControlLabel
          control={
            <Controller
              as={<Checkbox color="primary" />}
              name="origin"
              control={control}
              defaultValue={false}
            />
          }
          label="Primljena i obrađena u GLAVNOJ POŠTI"
        />
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <FormControlLabel
          control={
            <Controller
              as={<Checkbox color="primary" />}
              name="destination"
              control={control}
              defaultValue={false}
            />
          }
          label="Primljena i obrađena u ODREDIŠNOJ POŠTI"
        />
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <FormControlLabel
          control={
            <Controller
              as={<Checkbox color="primary" />}
              name="delivered"
              control={control}
              defaultValue={false}
            />
          }
          label="Isporučena"
        />
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <FormControl
          className={classes.formControl}
          error={Boolean(errors.weight)}
          required
        >
          <InputLabel id="weight-select-label">Kategorija težine</InputLabel>
          {/* Properties of the Controller (docs: https://react-hook-form.com/api#Controller) */}
          <Controller
            as={
              <Select labelId="weight-select-label">
                <MenuItem value="">
                  <em>--</em>
                </MenuItem>
                {shipmentTableStore.weights.map((weight) => (
                  <MenuItem key={weight.id} value={weight.id}>
                    {weight.desc}
                  </MenuItem>
                ))}
              </Select>
            }
            name="weight"
            control={control}
            rules={{ required: true }}
            defaultValue={""}
          />
          <FormHelperText>
            {/*
            React Hook Form provides an errors object to show you the errors in the form
            (docs: https://react-hook-form.com/get-started#Handleerrors)
            */}
            {errors.type && "Kategorija težine je obavezna"}
          </FormHelperText>
        </FormControl>
      </FormGroup>
      <FormGroup row className={classes.formGroupRow}>
        <FormControl
          className={classes.formControl}
          error={Boolean(errors.office)}
          required
        >
          <InputLabel id="post-office-select-label">Pošta</InputLabel>
          {/* Properties of the Controller (docs: https://react-hook-form.com/api#Controller) */}
          <Controller
            as={
              <Select labelId="post-office-select-label">
                <MenuItem value="">
                  <em>--</em>
                </MenuItem>
                {postOfficeTableStore.rows.map((postOffice) => (
                  <MenuItem key={postOffice.id} value={postOffice.id}>
                    {postOffice.name}
                  </MenuItem>
                ))}
              </Select>
            }
            name="office"
            control={control}
            rules={{ required: true }}
            defaultValue={""}
          />
          <FormHelperText>
            {/*
            React Hook Form provides an errors object to show you the errors in the form
            (docs: https://react-hook-form.com/get-started#Handleerrors)
            */}
            {errors.office && "Pošta je obavezna"}
          </FormHelperText>
        </FormControl>
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
