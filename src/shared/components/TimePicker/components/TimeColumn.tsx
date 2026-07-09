import React from 'react';
import * as Styled from '../styles';
import type { TimeColumnProps } from './types';

export const TimeColumn: React.FC<TimeColumnProps> = (props) => {
  const {
    ariaLabel,
    options,
    selected,
    listRef,
    isOptionDisabled,
    onSelect,
  } = props;

  return (
    <Styled.Column>
      <Styled.ColumnList ref={listRef} role="listbox" aria-label={ariaLabel}>
        {options.map((option) => {
          const optionDisabled = isOptionDisabled?.(option) ?? false;

          return (
            <Styled.ColumnItem key={option} role="presentation">
              <Styled.OptionButton
                type="button"
                role="option"
                aria-selected={option === selected}
                aria-disabled={optionDisabled}
                disabled={optionDisabled}
                $selected={option === selected}
                $disabled={optionDisabled}
                data-value={option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (optionDisabled) {
                    return;
                  }

                  onSelect(option);
                }}
              >
                {option}
              </Styled.OptionButton>
            </Styled.ColumnItem>
          );
        })}
      </Styled.ColumnList>
    </Styled.Column>
  );
};
