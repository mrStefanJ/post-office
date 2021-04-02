import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import Grid from "@material-ui/core/Grid";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    color: red[500],
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export const PageNotFound = () => {
  // You can use Hooks here!
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container direction="row" justify="center" alignItems="center">
        <WarningIcon className={classes.icon} />{" "}
        <strong>Stranica koju tražite nije pronađena</strong>
      </Grid>
    </div>
  );
};
