import React, { HTMLProps, MutableRefObject, ReactElement } from 'react';
import { chainFunctions, chainRefFunctions } from "../../utils/function-utils";
import { VibeComponentProps } from "../../types";

export const Refable = React.forwardRef<
  ReactElement,
  React.PropsWithChildren<unknown & HTMLProps<any> & VibeComponentProps> & { children: ReactElement | ReactElement[] | string }
>(({ children, ...rest }, ref) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return null;

    if (typeof child.type !== "string") {
      return (
        <span ref={ref as MutableRefObject<any>} {...rest}>
          {React.cloneElement(child, { ...child.props })}
        </span>
      ) as ReactElement;
    }

    return React.cloneElement(child, {
      ...rest,
      ...child.props,
      onClick: getChainedFunction("onClick", child.props, rest),
      onBlur: getChainedFunction("onBlur", child.props, rest),
      onMouseEnter: getChainedFunction("onMouseEnter", child.props, rest),
      onMouseLeave: getChainedFunction("onMouseLeave", child.props, rest),
      onMouseDown: getChainedFunction("onMouseDown", child.props, rest),
      onFocus: getChainedFunction("onFocus", child.props, rest),
      ref: chainRefFunctions([child.ref, ref as MutableRefObject<any>])
    });
  });
});

function getChainedFunction(
  name: keyof React.HTMLProps<unknown>,
  childProps: React.PropsWithChildren<React.HTMLProps<unknown>>,
  wrapperProps: React.PropsWithChildren<React.HTMLProps<unknown>>
) {
  return chainFunctions([childProps[name], wrapperProps[name]], true);
}
