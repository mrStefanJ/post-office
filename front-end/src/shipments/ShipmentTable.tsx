import React, { useState, useContext, useEffect } from "react";

import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CreateUpdateShipmentDialog from "./create-update-shipment";
import DeleteShipmentDialog from "./delete-shipment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import InfoIcon from "@material-ui/icons/Info";

import { useStores } from "../common/useStores";
import { LoaderContext } from "../common/LoaderContext";
import { ToastContext } from "../common/ToastContext";
import { readShipmentsAPI } from "./ShipmentAPI";
import { readPostOfficesAPI } from "../post-offices/PostOfficeAPI";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  container: {
    maxHeight: 440,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export const ShipmentTable = observer(() => {
  // You can use Hooks here!
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /*
  Consuming and using store / context:
  https://mobx-react.js.org/recipes-context#multiple-global-stores
  https://reactjs.org/docs/hooks-reference.html#usecontext
  */
  const { shipmentTableStore, postOfficeTableStore } = useStores();
  const showLoader = useContext(LoaderContext);
  const showToast = useContext(ToastContext);

  useEffect(() => {
    showLoader(true);

    readShipmentsAPI()
      .then((response) => {
        showLoader(false);

        if (response.statusText.toLowerCase() === "ok") {
          shipmentTableStore.setShipments(response.data);

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
        showToast("Greška prilikom učitavanja pošiljki.");
      });
  }, [shipmentTableStore, postOfficeTableStore, showLoader, showToast]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Dialog with form fields (docs: https://material-ui.com/components/dialogs/#form-dialogs) */}
          <CreateUpdateShipmentDialog operation="create" />
        </Grid>
        <Grid item xs={12}>
          {shipmentTableStore.rows.length > 0 ? (
            <>
              {/*
              Table with pagination, fixed column headers and scrollable rows
              (docs: https://material-ui.com/components/tables/#fixed-header)
              */}
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {shipmentTableStore.columns.map((column) => (
                        <TableCell key={column.id}>{column.label}</TableCell>
                      ))}
                      <TableCell
                        align="center"
                        style={{ width: "130px" }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shipmentTableStore.rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, rowIndex) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            {shipmentTableStore.columns.map((column) => {
                              return (
                                <TableCell key={column.id}>
                                  {column.id === "type" && column.formatType
                                    ? column.formatType(row[column.id])
                                    : ""}
                                  {(column.id === "origin" ||
                                    column.id === "destination" ||
                                    column.id === "delivered") &&
                                  column.formatStatus
                                    ? column.formatStatus(row[column.id])
                                    : ""}
                                  {column.id === "weight" && column.formatWeight
                                    ? column.formatWeight(row[column.id])
                                    : ""}
                                  {column.id === "office" &&
                                  column.formatPostOffice
                                    ? column.formatPostOffice(row[column.id])
                                    : ""}
                                </TableCell>
                              );
                            })}
                            <TableCell
                              align="center"
                              style={{ width: "130px" }}
                            >
                              {/*
                              Dialog with form fields
                              (docs: https://material-ui.com/components/dialogs/#form-dialogs)
                              */}
                              <CreateUpdateShipmentDialog
                                operation="update"
                                data={{ shipment: row, rowIndex }}
                              />
                              {/*
                              Dialog asking for confirmation
                              (docs: https://material-ui.com/components/dialogs/#alerts)
                              */}
                              <DeleteShipmentDialog
                                data={{ shipmentId: row.id, rowIndex }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={shipmentTableStore.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage="Redova po stranici:"
              />
            </>
          ) : (
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <InfoIcon className={classes.icon} /> Nema dostupnih podataka o
              pošiljkama
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
});
