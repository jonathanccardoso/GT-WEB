import React from "react";
import PropTypes from "prop-types";

import * as Styled from "./styled";

import { ReactComponent as Logo } from "../../assets/icons/logotype.svg";

const Header = ({ siteTitle }) => {
  return (
    <Styled.Header>
      <Styled.Container>
        <div>
          <Logo />
          <a href="/subject">
            <Styled.KeyboardArrowLeftIcon />
          </a>
          <h1>{siteTitle}</h1>
        </div>
        <div>
          <Styled.MessageIcon />
          {/* <Bell /> */}
          <img src="" alt="" />
          <Styled.KeyboardArrowDownIcon />
        </div>
      </Styled.Container>
    </Styled.Header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
