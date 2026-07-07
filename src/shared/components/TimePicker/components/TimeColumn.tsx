import React from 'react';
import * as Styled from '../styles';
import type { TimeColumnProps } from './types';

export const TimeColumn: React.FC<TimeColumnProps> = (props) => {
  const { ariaLabel, options, selected, listRef, onSelect } = props;

  return (
    <Styled.Column>
      <Styled.ColumnList ref={listRef} role="listbox" aria-label={ariaLabel}>
        {options.map((option) => (
          <Styled.ColumnItem key={option} role="presentation">
            <Styled.OptionButton
              type="button"
              role="option"
              aria-selected={option === selected}
              $selected={option === selected}
              data-value={option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(option)}
            >
              {option}
            </Styled.OptionButton>
          </Styled.ColumnItem>
        ))}
      </Styled.ColumnList>
    </Styled.Column>
  );
};
