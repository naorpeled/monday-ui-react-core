import { camelCase } from "lodash";
import cx from "classnames";
import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import CloseSmall from "../../components/Icon/Icons/components/CloseSmall";
import { BACKGROUND_COLORS } from "./AlertBannerConstants";
import { ELEMENT_TYPES, getTestId } from "../../utils/test-utils";
import styles from "./AlertBanner.module.scss";

const NOOP = () => {};

const AlertBanner = forwardRef(
  (
    {
      children: originalChildren,
      className,
      backgroundColor,
      onClose,
      ariaLabel,
      isCloseHidden,
      id,
      "data-testid": dataTestId
    },
    ref
  ) => {
    const classNames = useMemo(() => {
      return cx(
        className,
        styles.banner,
        "monday-alert-banner",
        styles[camelCase("background-color-" + backgroundColor)],
        `monday-alert-banner--background-color-${backgroundColor}`
      );
    }, [className, backgroundColor]);

    const isDarkBackground = backgroundColor === AlertBanner.backgroundColors.DARK;
    const children = useMemo(() => {
      const allChildren = React.Children.toArray(originalChildren);
      const filteredChildren = allChildren.filter(child => {
        if (child.type.isAlertBannerItem || child.type.displayName === "MDXCreateElement") return true;
        console.error(
          "Alert banner child is not supported. Please use AlertBannerText, AlertBannerLink or AlertBannerButton.",
          child
        );
        return false;
      });

      return filteredChildren.map((child, index) => {
        return React.cloneElement(child, {
          ...child?.props,
          marginLeft: index > 0,
          isDarkBackground
        });
      });
    }, [originalChildren, isDarkBackground]);

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId || getTestId(ELEMENT_TYPES.ALERT_BANNER, id)}
        className={classNames}
        role="banner"
        aria-label={ariaLabel || "banner"}
      >
        <div className={cx(styles.inner, "monday-alert-banner__inner")}>
          {children.map((child, index) => {
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={cx(styles.innerItem, "monday-alert-banner__inner-item", {
                  [styles.innerItemText]: child.type.isAlertBannerText,
                  ["monday-alert-banner__inner-item-text"]: child.type.isAlertBannerText
                })}
              >
                {child.type.isAlertBannerText ? (
                  <div className={cx(styles.ellipsis, "monday-alert-banner__ellipsis")}>{child}</div>
                ) : (
                  child
                )}
              </div>
            );
          })}
        </div>
        <div className={cx(styles.closeButtonWrapper, "monday-alert-banner__close-button-wrapper")}>
          {isCloseHidden ? null : (
            <Button
              className={cx(styles.closeBtn, "monday-alert-banner__alert-banner-close-btn")}
              onClick={onClose}
              size={Button.sizes.SMALL}
              kind={Button.kinds.TERTIARY}
              color={isDarkBackground ? Button.colors.ON_INVERTED_BACKGROUND : Button.colors.ON_PRIMARY_COLOR}
              ariaLabel="close-toast"
            >
              <Icon iconType={Icon.type.SVG} clickable={false} icon={CloseSmall} iconSize="20px" ignoreFocusStyle />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

AlertBanner.backgroundColors = BACKGROUND_COLORS;
AlertBanner.propTypes = {
  /**
   * Set external styling to the progress bar.
   */
  className: PropTypes.string,
  backgroundColor: PropTypes.oneOf([
    AlertBanner.backgroundColors.PRIMARY,
    AlertBanner.backgroundColors.NEGATIVE,
    AlertBanner.backgroundColors.POSITIVE,
    AlertBanner.backgroundColors.DARK
  ]),
  isCloseHidden: PropTypes.bool,
  /** ARIA description for the progress bar */
  ariaLabel: PropTypes.string,
  onClose: PropTypes.func
};

AlertBanner.defaultProps = {
  backgroundColor: AlertBanner.backgroundColors.PRIMARY,
  isCloseHidden: false,
  className: "",
  ariaLabel: "",
  onClose: NOOP
};

export default AlertBanner;
