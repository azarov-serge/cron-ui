import React from 'react';
import { T } from '@admiral-ds/react-ui';

export interface SectionLabelProps {
  /** Красная «*» в стиле Admiral — только для обязательных полей */
  required?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const SectionLabel: React.FC<SectionLabelProps> = (props) => {
  const { required, style, children } = props;

  return (
    <T
      font="Body/Body 2 Short"
      color="Neutral/Neutral 50"
      style={{ display: 'block', marginBottom: 8, ...style }}
    >
      {children}
      {required ? (
        <T font="Body/Body 2 Short" color="Error/Error 60 Main" as="span">
          {' *'}
        </T>
      ) : null}
    </T>
  );
};
