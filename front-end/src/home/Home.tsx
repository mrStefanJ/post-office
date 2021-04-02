import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";

import belgradeSkyline from "../assets/images/belgrade-skyline-1720x384.png";
import logo from "../assets/images/logo-200x200.png";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(10),
    marginRight: theme.spacing(10),
    marginLeft: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  responsiveImage: {
    maxWidth: "100%",
    height: "auto",
    marginBottom: theme.spacing(2),
  },
  logo: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export const Home = () => {
  // You can use Hooks here!
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img
        src={belgradeSkyline}
        alt="Moja pošta"
        className={classes.responsiveImage}
      />
      <Grid container direction="row" justify="center" alignItems="center">
        Dobrodošli u aplikaciju{" "}
        <Avatar
          variant="square"
          alt="Moja pošta"
          src={logo}
          className={classes.logo}
        />{" "}
        <strong>Moja pošta</strong>.
      </Grid>
    </div>
  );
};
