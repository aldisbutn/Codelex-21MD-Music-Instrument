'use client'
import React, { useState } from 'react';
import Knob, { SkinWrap, KnobProps, composeTwo, useAngleUpdater } from 'react-dial-knob';

interface MyKnobSkinTheme {
  activeColor?: string;
  defaultColor?: string;
}

interface MyKnobSkinProps extends KnobProps {
  theme?: MyKnobSkinTheme;
  style?: React.CSSProperties;
}

export default function KnobSkin(props: MyKnobSkinProps): JSX.Element {
  const [angle, setAngle] = useAngleUpdater(props.value);
  const [isActive, setIsActive] = useState(false);
  const theme = props.theme || {};
  const activeColor = theme.activeColor || '#b56a7a';
  const defaultColor = theme.defaultColor || '#100';
  const bgrColor = isActive ? activeColor : defaultColor;
  const angleChangeHandler = composeTwo<number>(setAngle, props.onAngleChange);
  const interactionChangeHandler = composeTwo<boolean>(setIsActive, props.onInteractionChange);
  return (
    <SkinWrap style={props.style}>
      <Knob
        diameter={props.diameter}
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        spaceMaxFromZero={props.spaceMaxFromZero}
        ariaLabelledBy={props.ariaLabelledBy}
        ariaValueText={props.ariaValueText}
        knobStyle={{ cursor: 'pointer', ...props.knobStyle }}
        onAngleChange={angleChangeHandler}
        onInteractionChange={interactionChangeHandler}
        onValueChange={props.onValueChange}
      >
        <svg viewBox='0 0 100 100' transform={`rotate(${angle})`} style={{ transform: `rotate(${angle}deg)` }}>
          <g>
            <circle cx='50.2' cy='50.2' r='50' />
          </g>
          <g>
            <circle fill='#FFEEDA' cx='50.2' cy='50.2' r='46.07' />
          </g>
          <g>
            <rect x='47.38' y='2.1' fill='#F69922' width='5.65' height='48.1' />
          </g>
        </svg>
      </Knob>
      {props.children}
    </SkinWrap>
  );
}
