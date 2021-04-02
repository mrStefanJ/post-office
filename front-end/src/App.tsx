import React, { useState, useCallback, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { Mail, AccountBalance } from "@material-ui/icons";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import logo from "./assets/images/logo-200x200.png";
import { LoaderContext } from "./common/LoaderContext";
import { ToastContext } from "./common/ToastContext";

// Route-based code splitting (docs: https://reactjs.org/docs/code-splitting.html#route-based-code-splitting)
const Home = lazy(() => import("./home"));
const Shipments = lazy(() => import("./shipments"));
const PostOffices = lazy(() => import("./post-offices"));
const PageNotFound = lazy(() => import("./page-not-found"));

// Override the default palette values (docs: https://material-ui.com/customization/palette/#customization)
const theme = createMuiTheme({
  palette: {
    primary: amber,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
  },
  linkButton: {
    textTransform: "capitalize",
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const App = () => {
  // You can use Hooks here!
  const classes = useStyles();

  const [loader, setLoader] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; open: boolean }>({
    message: "",
    open: false,
  });

  /*
  handleLoaderToggle and handleToastToggle methods are memoized with useCallback
  to prevent infinite loop when passed in useEffect array of dependencies
  (docs: https://reactjs.org/docs/hooks-reference.html#usecallback)
  */
  const handleLoaderToggle = useCallback((state: boolean) => {
    setLoader(state);
  }, []);

  const handleToastToggle = useCallback((text: string) => {
    if (text.length > 0) setToast({ message: text, open: true });
    else handleToastClose();
  }, []);

  const handleToastClose = () => {
    setToast({ message: "", open: false });
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        {/*
        The handleLoaderToggle (LoaderContext) and handleToastToggle (ToastContext) functions
        are passed to the providers
        (docs: https://reactjs.org/docs/context.html#updating-context-from-a-nested-component)
        */}
        <LoaderContext.Provider value={handleLoaderToggle}>
          <ToastContext.Provider value={handleToastToggle}>
            {/* Layout from Dashboard template (docs: https://material-ui.com/getting-started/templates/) */}
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="absolute">
                <Toolbar className={classes.toolbar}>
                  <Button component={Link} to="/">
                    {/* Square avatar (docs: https://material-ui.com/components/avatars/#variants) */}
                    <Avatar variant="square" alt="Moja pošta" src={logo} />
                  </Button>
                  <Button
                    component={Link}
                    to="/shipments"
                    className={classes.linkButton}
                  >
                    <Mail className={classes.icon} /> Pošiljke
                  </Button>
                  <Button
                    component={Link}
                    to="/post-offices"
                    className={classes.linkButton}
                  >
                    <AccountBalance className={classes.icon} /> Pošte
                  </Button>
                </Toolbar>
                {loader && <LinearProgress />}
              </AppBar>
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Suspense fallback={<div>Učitavanje...</div>}>
                        <Switch>
                          <Route exact path="/" component={Home} />
                          <Route path="/shipments" component={Shipments} />
                          <Route path="/post-offices" component={PostOffices} />
                          {/* No Match (404) (docs: https://reacttraining.com/react-router/web/example/no-match) */}
                          <Route path="*" component={PageNotFound} />
                        </Switch>
                      </Suspense>
                    </Grid>
                  </Grid>
                </Container>
                {/* Basic snackbar (docs: https://material-ui.com/components/snackbars/#simple-snackbars) */}
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  open={toast.open}
                  autoHideDuration={4000}
                  onClose={handleToastClose}
                  message={toast.message}
                />
              </main>
            </div>
          </ToastContext.Provider>
        </LoaderContext.Provider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
