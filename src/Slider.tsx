import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";

export const Wrapper = styled.div`
  height: 3rem;
  display: flex;
  width: 100%;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
`;

export const BackgroundBar = styled.div`
  height: 1rem;
  width: 100%;
  border-radius: calc(1rem / 2);
  background: #f2f2f2;
  overflow: visible;
  position: relative;
`;

export const IndicatorBar = styled.div<{ position: number }>`
  background: blue;
  height: 100%;
  position: absolute;
  width: ${p => `${p.position}%`};
  border-radius: calc(2rem / 2);
`;

export const Dot = styled.div<{ position: number }>`
  width: 2rem;
  height: 2rem;
  position: absolute;
  background: #fff;
  border-radius: calc(2rem / 2);
  transform: translateY(calc(2rem / -4)) translateX(calc(2rem / -4));
  left: ${p => `${p.position}%`};
  box-shadow: 0 0 0.2rem 0 blue;
`;

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  onChange(newValue: number): void;
  value: number;
};

function Slider({ min, max, step, onChange, value }: SliderProps) {
  const [haveMouseDownFocus, setMouseDownFocus] = useState(false);
  const ref = useRef<undefined | HTMLDivElement>();

  const handleTouchEvent = useCallback(
    function(e: React.TouchEvent<HTMLDivElement>) {
      const clientRect = ref.current.getBoundingClientRect();
      let newValue = min;

      if (e.targetTouches.length > 1) {
        setMouseDownFocus(false);
        return;
      }

      if (e.targetTouches[0].clientX > clientRect.left) {
        const newFraction =
          (e.targetTouches[0].clientX - clientRect.left) / clientRect.width;
        const range = Math.abs(max - min);
        newValue = range * newFraction + min;
      }

      newValue = newValue - (newValue % step);

      onChange(newValue);

      if (e.type === "touchstart") {
        setMouseDownFocus(true);
      }
    },
    [haveMouseDownFocus, setMouseDownFocus, onChange, ref]
  );

  const handleMouseEvent = useCallback(
    function(e: React.MouseEvent) {
      if (e.type === "mousedown") {
        setMouseDownFocus(true);
      }

      if (e.type !== "mousedown" && !haveMouseDownFocus) {
        return;
      }

      if (e.type === "mousedown" || e.type === "mousemove") {
        if (e.buttons === 1 && e.button === 0) {
          const clientRect = e.currentTarget.getBoundingClientRect();
          let newValue = min;

          if (e.clientX > clientRect.left) {
            const newFraction =
              (e.clientX - clientRect.left) / clientRect.width;
            const range = Math.abs(max - min);
            newValue = range * newFraction + min;
          }

          newValue = newValue - (newValue % step);

          onChange(newValue);
        }
      }
    },
    [haveMouseDownFocus, onChange, setMouseDownFocus]
  );

  function focusEndHandler() {
    setMouseDownFocus(false);
  }

  useEffect(() => {
    if (haveMouseDownFocus) {
      window.addEventListener("mouseup", focusEndHandler);
      window.addEventListener("touchend", focusEndHandler);
      window.addEventListener("touchcancel", focusEndHandler);
    }
    return () => {
      if (!haveMouseDownFocus) {
        window.removeEventListener("mouseup", focusEndHandler);
        window.removeEventListener("touchend", focusEndHandler);
        window.removeEventListener("touchcancel", focusEndHandler);
      }
    };
  }, [haveMouseDownFocus, setMouseDownFocus]);

  const mouseMoveListener = useCallback(
    function(this: Window, ev: MouseEvent) {
      if (!haveMouseDownFocus || ref.current === undefined) {
        return;
      }

      const sliderBoundingRect = ref.current.getBoundingClientRect();

      if (ev.clientX <= sliderBoundingRect.left) {
        onChange(min);
      } else if (
        ev.clientX >=
        sliderBoundingRect.left + sliderBoundingRect.width
      ) {
        onChange(max);
      } else {
        const newFraction =
          (ev.clientX - sliderBoundingRect.left) / sliderBoundingRect.width;
        const range = Math.abs(max - min);
        let newValue = range * newFraction + min;
        newValue = newValue - (newValue % step);
        onChange(newValue);
      }
    },
    [haveMouseDownFocus, ref, value, onChange]
  );

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveListener);
    return () => {
      window.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [haveMouseDownFocus]);

  const position = ((value - min) / (max - min)) * 100;

  return (
    <Wrapper
      ref={ref}
      onMouseMove={handleMouseEvent}
      onMouseDown={handleMouseEvent}
      onMouseUp={focusEndHandler}
      onTouchStart={handleTouchEvent}
      onTouchMove={handleTouchEvent}
      onTouchCancel={focusEndHandler}
      onTouchEnd={focusEndHandler}
    >
      <BackgroundBar>
        <IndicatorBar position={position} />
        <Dot position={position} />
      </BackgroundBar>
    </Wrapper>
  );
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1
};

export default Slider;
