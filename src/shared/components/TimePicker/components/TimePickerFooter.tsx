import React from 'react';
import { TextButton } from '@admiral-ds/react-ui';
import * as Styled from '../styles';
import type { TimePickerFooterProps } from './types';

export const TimePickerFooter: React.FC<TimePickerFooterProps> = (props) => {
  const { onNow } = props;

  return (
    <Styled.Footer>
      <TextButton
        appearance="primary"
        dimension="s"
        text="Сейчас"
        onClick={onNow}
      />
    </Styled.Footer>
  );
};
