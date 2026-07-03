import {
  changeInputData,
  InputBox,
  InputIconButton,
  InputLine,
  isInputDataDifferent,
  keyboardKey,
  LIGHT_THEME,
  refSetter,
  StyledDropdownContainer,
  typography,
} from '@admiral-ds/react-ui';
import TimeOutlineIcon from './timeOutline.svg?react';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type MouseEvent,
  type RefObject,
} from 'react';
import styled from 'styled-components';
import {
  combineTimeString,
  getHourOptions,
  getMinuteOptionsForStep,
  snapMinuteToStep,
  splitTimeString,
} from '@shared/utils/time';
import { timePickerInputHandle } from './timePickerInputHandle';

const StyledInputBox = styled(InputBox)`
  width: 100%;
  max-width: 100%;
`;

const Panel = styled.div`
  display: flex;
  width: max-content;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 56px;
`;

const ColumnHeader = styled.div`
  ${typography['Body/Body 2 Short']};
  padding: 8px 12px;
  text-align: center;
  color: ${LIGHT_THEME.color['Neutral/Neutral 50']};
  border-bottom: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
`;

const ColumnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 224px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const ColumnItem = styled.li``;

const OptionButton = styled.button<{ $selected?: boolean }>`
  ${typography['Body/Body 1 Long']};
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: ${({ $selected }) =>
    $selected ? LIGHT_THEME.color['Primary/Primary 10'] : 'transparent'};
  color: ${({ $selected }) =>
    $selected
      ? LIGHT_THEME.color['Primary/Primary 60 Main']
      : LIGHT_THEME.color['Neutral/Neutral 90']};
  cursor: pointer;
  text-align: center;

  &:hover {
    background: ${({ $selected }) =>
      $selected
        ? LIGHT_THEME.color['Primary/Primary 10']
        : LIGHT_THEME.color['Neutral/Neutral 10']};
  }

  &:focus-visible {
    outline: 2px solid ${LIGHT_THEME.color['Primary/Primary 60 Main']};
    outline-offset: -2px;
  }
`;

const IconPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding-right: 12px;
  pointer-events: auto;
`;

const isCompleteTime = (time: string): boolean =>
  /^\d{2}:\d{2}$/.test(time) && !time.includes('_');

const parseTimeValue = (time?: string): string =>
  time && isCompleteTime(time) ? time : '';

interface TimeColumnProps {
  label: string;
  options: string[];
  selected: string;
  listRef: React.Ref<HTMLUListElement>;
  onSelect: (value: string) => void;
}

const TimeColumn: FC<TimeColumnProps> = (props) => {
  const { label, options, selected, listRef, onSelect } = props;

  return (
    <Column>
      <ColumnHeader>{label}</ColumnHeader>
      <ColumnList ref={listRef} role="listbox" aria-label={label}>
        {options.map((option) => (
          <ColumnItem key={option} role="presentation">
            <OptionButton
              type="button"
              role="option"
              aria-selected={option === selected}
              $selected={option === selected}
              data-value={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(option)}
            >
              {option}
            </OptionButton>
          </ColumnItem>
        ))}
      </ColumnList>
    </Column>
  );
};

const scrollOptionIntoView = (
  listElement: HTMLUListElement | null,
  selectedValue: string,
) => {
  if (!listElement) {
    return;
  }

  const selectedButton = listElement.querySelector(
    `[data-value="${selectedValue}"]`,
  );

  if (selectedButton instanceof HTMLElement) {
    selectedButton.scrollIntoView({ block: 'center' });
  }
};

export interface TimePickerProps {
  value: string;
  disabled?: boolean;
  minuteStep?: number;
  onChange: (value: string) => void;
}

export const TimePicker: FC<TimePickerProps> = (props) => {
  const { value, disabled = false, minuteStep = 1, onChange } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hourListRef = useRef<HTMLUListElement>(null);
  const minuteListRef = useRef<HTMLUListElement>(null);
  const [innerValue, setInnerValue] = useState(value);
  const [isOpened, setIsOpened] = useState(false);

  const hourOptions = useMemo(() => getHourOptions(), []);
  const minuteOptions = useMemo(
    () => getMinuteOptionsForStep(minuteStep),
    [minuteStep],
  );

  const { hour: selectedHour, minute: selectedMinute } = useMemo(() => {
    const parts = splitTimeString(parseTimeValue(innerValue) || '00:00');
    const snappedMinute = snapMinuteToStep(parts.minute, minuteStep);
    const minute = minuteOptions.includes(snappedMinute)
      ? snappedMinute
      : (minuteOptions[0] ?? '00');

    return { hour: parts.hour, minute };
  }, [innerValue, minuteOptions, minuteStep]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    if (!isOpened) {
      return;
    }

    scrollOptionIntoView(hourListRef.current, selectedHour);
    scrollOptionIntoView(minuteListRef.current, selectedMinute);
  }, [isOpened, selectedHour, selectedMinute]);

  useLayoutEffect(() => {
    const nullHandledValue = timePickerInputHandle(null);

    const handleInputEvent = function handleInputEvent(this: HTMLInputElement) {
      const { value: currentValue, selectionStart, selectionEnd } = this;
      const currentInputData = {
        value: currentValue,
        selectionStart,
        selectionEnd,
      };
      const inputData = timePickerInputHandle(currentInputData);

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

      if (isCompleteTime(this.value)) {
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
    const inputData = timePickerInputHandle(currentInputData);

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
  }, [onChange]);

  const applyTime = (nextHour: string, nextMinute: string) => {
    const nextValue = combineTimeString(nextHour, nextMinute);

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

  const handleContainerMouseDown = (event: MouseEvent<HTMLDivElement>) => {
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
    applyTime(hour, selectedMinute);
  };

  const handleSelectMinute = (minute: string) => {
    applyTime(selectedHour, minute);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInnerValue(event.currentTarget.value);
  };

  const handleBlur = () => {
    const parsedTime = parseTimeValue(inputRef.current?.value ?? innerValue);
    if (parsedTime && parsedTime !== value) {
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

  return (
    <>
      <StyledInputBox
        ref={containerRef}
        $dimension="m"
        disabled={disabled}
        $iconsAfterCount={1}
        className="time-picker"
        onMouseDown={handleContainerMouseDown}
      >
        <InputLine
          ref={refSetter(inputRef)}
          value={innerValue}
          disabled={disabled}
          placeholder="чч:мм"
          dataPlaceholder="чч:мм"
          className="time-picker-input"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <IconPanel>
          <InputIconButton
            width={24}
            height={24}
            icon={TimeOutlineIcon}
            tabIndex={0}
            aria-label="Выбрать время"
          />
        </IconPanel>
      </StyledInputBox>

      {isOpened && !disabled && (
        <StyledDropdownContainer
          ref={dropdownRef as RefObject<HTMLDivElement>}
          targetElement={containerRef.current}
          alignSelf="flex-end"
          onClickOutside={handleClickOutside}
        >
          <Panel>
            <TimeColumn
              label="Часы"
              options={hourOptions}
              selected={selectedHour}
              listRef={hourListRef}
              onSelect={handleSelectHour}
            />
            <TimeColumn
              label="Мин."
              options={minuteOptions}
              selected={selectedMinute}
              listRef={minuteListRef}
              onSelect={handleSelectMinute}
            />
          </Panel>
        </StyledDropdownContainer>
      )}
    </>
  );
};
