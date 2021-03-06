import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/errorPageStyles.js";

const useStyles = makeStyles(styles);
function getURLParams() {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  return params
}
export default function LoginRedirect() {
  const classes = useStyles();
  const params = getURLParams()
  console.log(params)
  const code = params.get('code') === undefined ? "???" : params.get('code')
  const message = params.get('msg') === undefined ? "Unknown Error" : params.get('msg')
  window.location.replace("/accounts/login")

  return (
    <div className={classes.contentCenter}>
      <GridContainer>
        <GridItem md={12}>
          <h1 className={classes.title}>LOGGING IN  </h1>
          <h2 className={classes.subTitle}></h2>
          <h4 className={classes.description}>
          
          </h4>
        </GridItem>
      </GridContainer>
    </div>
  );
}
