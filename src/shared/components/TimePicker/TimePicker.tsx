import React from 'react';
import {
  changeInputData,
  type ComponentDimension,
  InputIconButton,
  InputLine,
  isInputDataDifferent,
  keyboardKey,
  refSetter,
  StyledDropdownContainer,
} from '@admiral-ds/react-ui';

import CloseOutlineIcon from '@admiral-ds/icons/build/service/CloseOutline.svg?react';
import {
  combineTimeString,
  getHourOptions,
  getMinuteOptionsForStep,
  getSecondOptions,
  snapMinuteToStep,
  splitTimeString,
} from '@shared/components/TimePicker/utils/time';
import { TimeColumn, TimePickerFooter } from './components';
import * as Styled from './styles';
import type { RuleSet } from 'styled-components';
import TimeOutlineIcon from './assets/timeOutline.svg?react';
import {
  getCurrentTimeString,
  isCompleteTime,
  parseTimeValue,
  scrollOptionIntoView,
  timePickerInputHandle,
  toDisplayValue,
} from './utils';

export interface TimePickerProps {
  className?: string;
  inputBoxCss?: RuleSet<object>;
  value: string | null;
  dimension?: ComponentDimension;
  disabled?: boolean;
  minuteStep?: number;
  withSeconds?: boolean;
  displayClearIcon?: boolean;
  showNow?: boolean;
  onChange: (value: string | null) => void;
}

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  const {
    className,
    inputBoxCss,
    value,
    dimension = 's',
    disabled = false,
    minuteStep = 1,
    withSeconds = false,
    displayClearIcon = false,
    showNow = false,
    onChange,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hourListRef = React.useRef<HTMLUListElement>(null);
  const minuteListRef = React.useRef<HTMLUListElement>(null);
  const secondListRef = React.useRef<HTMLUListElement>(null);
  const [innerValue, setInnerValue] = React.useState(() =>
    toDisplayValue(value),
  );
  const [isOpened, setIsOpened] = React.useState(false);

  const hourOptions = React.useMemo(() => getHourOptions(), []);
  const minuteOptions = React.useMemo(
    () => getMinuteOptionsForStep(minuteStep),
    [minuteStep],
  );
  const secondOptions = React.useMemo(() => getSecondOptions(), []);

  const defaultTime = withSeconds ? '00:00:00' : '00:00';
  const placeholder = withSeconds ? 'чч:мм:сс' : 'чч:мм';
  const hasValue = value !== null;
  const iconsAfterCount = displayClearIcon && hasValue ? 2 : 1;
  const iconSize = dimension === 's' ? 20 : 24;

  const {
    hour: selectedHour,
    minute: selectedMinute,
    second: selectedSecond,
  } = React.useMemo(() => {
    const parts = splitTimeString(
      parseTimeValue(innerValue, withSeconds) || defaultTime,
      withSeconds,
    );
    const snappedMinute = snapMinuteToStep(parts.minute, minuteStep);
    const minute = minuteOptions.includes(snappedMinute)
      ? snappedMinute
      : (minuteOptions[0] ?? '00');
    const second = withSeconds
      ? secondOptions.includes(parts.second ?? '00')
        ? (parts.second ?? '00')
        : '00'
      : undefined;

    return { hour: parts.hour, minute, second };
  }, [
    defaultTime,
    innerValue,
    minuteOptions,
    minuteStep,
    secondOptions,
    withSeconds,
  ]);

  React.useEffect(() => {
    setInnerValue(toDisplayValue(value));
  }, [value]);

  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    scrollOptionIntoView(hourListRef.current, selectedHour);
    scrollOptionIntoView(minuteListRef.current, selectedMinute);

    if (withSeconds && selectedSecond) {
      scrollOptionIntoView(secondListRef.current, selectedSecond);
    }
  }, [isOpened, selectedHour, selectedMinute, selectedSecond, withSeconds]);

  React.useLayoutEffect(() => {
    const nullHandledValue = timePickerInputHandle(null, withSeconds);

    const handleInputEvent = function handleInputEvent(this: HTMLInputElement) {
      const { value: currentValue, selectionStart, selectionEnd } = this;
      const currentInputData = {
        value: currentValue,
        selectionStart,
        selectionEnd,
      };
      const inputData = timePickerInputHandle(currentInputData, withSeconds);

      if (!isInputDataDifferent(currentInputData, inputData)) {
        return;
      }

      if (!inputData || inputData.value === currentValue) {
        return;
      }

      if (!isInputDataDifferent(nullHandledValue, inputData)) {
        changeInputData(this, { ...inputData, value: '' });
      } else {
        changeInputData(this, inputData);
      }

      setInnerValue(this.value);

      if (!this.value) {
        onChange(null);
      } else if (isCompleteTime(this.value, withSeconds)) {
        onChange(this.value);
      }
    };

    const inputElement = inputRef.current;
    if (!inputElement) {
      return undefined;
    }

    inputElement.addEventListener('input', handleInputEvent);

    const { value: currentValue, selectionStart, selectionEnd } = inputElement;
    const currentInputData = {
      value: currentValue,
      selectionStart,
      selectionEnd,
    };
    const inputData = timePickerInputHandle(currentInputData, withSeconds);

    if (
      isInputDataDifferent(currentInputData, inputData) &&
      inputData &&
      inputData.value !== currentValue
    ) {
      if (!isInputDataDifferent(nullHandledValue, inputData)) {
        changeInputData(inputElement, { ...inputData, value: '' });
      } else {
        changeInputData(inputElement, inputData);
      }
    }

    return () => {
      inputElement.removeEventListener('input', handleInputEvent);
    };
  }, [onChange, withSeconds]);

  const applyTime = (
    nextHour: string,
    nextMinute: string,
    nextSecond?: string,
  ) => {
    const nextValue = withSeconds
      ? combineTimeString(
          nextHour,
          nextMinute,
          nextSecond ?? selectedSecond ?? '00',
        )
      : combineTimeString(nextHour, nextMinute);

    if (!inputRef.current) {
      setInnerValue(nextValue);
      onChange(nextValue);
      return;
    }

    changeInputData(inputRef.current, { value: nextValue });
    setInnerValue(nextValue);
    onChange(nextValue);
  };

  const openDropdown = () => {
    if (disabled) {
      return;
    }

    setIsOpened(true);
  };

  const handleContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      return;
    }

    const target = event.target as HTMLElement;

    if (inputRef.current?.contains(target) || target === inputRef.current) {
      return;
    }

    event.preventDefault();
    setIsOpened((opened) => !opened);
  };

  const handleClickOutside = (event: Event) => {
    const target = event.target as Node | null;

    if (target && containerRef.current?.contains(target)) {
      return;
    }

    if (target && dropdownRef.current?.contains(target)) {
      return;
    }

    setIsOpened(false);
  };

  const handleSelectHour = (hour: string) => {
    applyTime(hour, selectedMinute, selectedSecond);
  };

  const handleSelectMinute = (minute: string) => {
    applyTime(selectedHour, minute, selectedSecond);
  };

  const handleSelectSecond = (second: string) => {
    applyTime(selectedHour, selectedMinute, second);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(event.currentTarget.value);
  };

  const handleBlur = () => {
    const raw = inputRef.current?.value ?? innerValue;
    const parsedTime = parseTimeValue(raw, withSeconds);

    if (!parsedTime) {
      if (value !== null) {
        onChange(null);
      }
      return;
    }

    if (parsedTime !== value) {
      onChange(parsedTime);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const code = keyboardKey.getCode(event);

    if (code === keyboardKey.Escape && isOpened) {
      setIsOpened(false);
      event.preventDefault();
      event.stopPropagation();
    }

    if (code === keyboardKey.ArrowDown && !isOpened) {
      openDropdown();
      event.preventDefault();
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled || !hasValue) {
      return;
    }

    setIsOpened(false);

    if (inputRef.current) {
      changeInputData(inputRef.current, { value: '' });
    }

    setInnerValue('');
    onChange(null);
  };

  const handleNow = () => {
    const nextValue = getCurrentTimeString(minuteStep, withSeconds);
    const { hour, minute, second } = splitTimeString(nextValue, withSeconds);
    applyTime(hour, minute, second);
  };

  const inputBoxClassName = className
    ? `time-picker ${className}`
    : 'time-picker';

  return (
    <>
      <Styled.Root>
        <Styled.InputBox
          ref={containerRef}
          $dimension={dimension}
          disabled={disabled}
          $iconsAfterCount={iconsAfterCount}
          $css={inputBoxCss}
          className={inputBoxClassName}
          onMouseDown={handleContainerMouseDown}
        >
          <InputLine
            ref={refSetter(inputRef)}
            value={innerValue}
            disabled={disabled}
            placeholder={placeholder}
            dataPlaceholder={placeholder}
            className="time-picker-input"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <Styled.IconPanel $dimension={dimension}>
            {displayClearIcon && hasValue && (
              <InputIconButton
                width={iconSize}
                height={iconSize}
                icon={CloseOutlineIcon}
                tabIndex={0}
                aria-label="Очистить время"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleClear}
              />
            )}
            <InputIconButton
              width={iconSize}
              height={iconSize}
              icon={TimeOutlineIcon}
              tabIndex={0}
              aria-label="Выбрать время"
            />
          </Styled.IconPanel>
        </Styled.InputBox>
      </Styled.Root>

      {isOpened && !disabled && (
        <StyledDropdownContainer
          ref={dropdownRef as React.RefObject<HTMLDivElement>}
          targetElement={containerRef.current}
          alignSelf="flex-end"
          onClickOutside={handleClickOutside}
        >
          <Styled.Dropdown>
            <Styled.Panel>
              <TimeColumn
                ariaLabel="Часы"
                options={hourOptions}
                selected={selectedHour}
                listRef={hourListRef}
                onSelect={handleSelectHour}
              />
              <TimeColumn
                ariaLabel="Минуты"
                options={minuteOptions}
                selected={selectedMinute}
                listRef={minuteListRef}
                onSelect={handleSelectMinute}
              />
              {withSeconds && (
                <TimeColumn
                  ariaLabel="Секунды"
                  options={secondOptions}
                  selected={selectedSecond ?? '00'}
                  listRef={secondListRef}
                  onSelect={handleSelectSecond}
                />
              )}
            </Styled.Panel>
            {showNow && <TimePickerFooter onNow={handleNow} />}
          </Styled.Dropdown>
        </StyledDropdownContainer>
      )}
    </>
  );
};
