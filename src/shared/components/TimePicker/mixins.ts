import { css, type DefaultTheme, type RuleSet } from 'styled-components';

export type InputBoxBorderSide = 'top' | 'right' | 'bottom' | 'left';

export type InputBoxBorderOptions = {
  /** Толщина «рамки» в px (через inset box-shadow). По умолчанию 1. */
  width?: number;
  /** Стороны, которые не рисовать. У соответствующих углов сбрасывается border-radius. */
  hide?: InputBoxBorderSide[];
};

type InputBoxBorderState = 'default' | 'hover' | 'focus';

const isSideHidden = (hide: InputBoxBorderSide[] | undefined, side: InputBoxBorderSide): boolean =>
  hide?.includes(side) ?? false;

const resolveInputBoxBorderColor = (
  theme: DefaultTheme,
  state: InputBoxBorderState = 'default',
): string => {
  if (state === 'hover') {
    return `var(--admiral-color-Neutral_Neutral60, ${theme.color['Neutral/Neutral 60']})`;
  }

  if (state === 'focus') {
    return `var(--admiral-color-Primary_Primary60Main, ${theme.color['Primary/Primary 60 Main']})`;
  }

  return `var(--admiral-color-Neutral_Neutral40, ${theme.color['Neutral/Neutral 40']})`;
};

const inputBoxInsetShadow = (color: string, options?: InputBoxBorderOptions): string => {
  const width = options?.width ?? 1;
  const hide = options?.hide;

  const shadows: string[] = [];

  if (!isSideHidden(hide, 'top')) {
    shadows.push(`inset 0 ${width}px 0 0 ${color}`);
  }

  if (!isSideHidden(hide, 'right')) {
    shadows.push(`inset -${width}px 0 0 0 ${color}`);
  }

  if (!isSideHidden(hide, 'bottom')) {
    shadows.push(`inset 0 -${width}px 0 0 ${color}`);
  }

  if (!isSideHidden(hide, 'left')) {
    shadows.push(`inset ${width}px 0 0 0 ${color}`);
  }

  if (shadows.length === 0) {
    return 'none';
  }

  if (shadows.length === 4 && width === 1) {
    return `inset 0 0 0 1px ${color}`;
  }

  return shadows.join(', ');
};

const inputBoxBorderRadius = (options?: InputBoxBorderOptions): RuleSet<object> => {
  const hide = options?.hide;

  if (!hide?.length) {
    return css``;
  }

  const hideTop = isSideHidden(hide, 'top');
  const hideRight = isSideHidden(hide, 'right');
  const hideBottom = isSideHidden(hide, 'bottom');
  const hideLeft = isSideHidden(hide, 'left');

  return css`
    ${hideTop || hideLeft ? 'border-top-left-radius: 0;' : ''}
    ${hideTop || hideRight ? 'border-top-right-radius: 0;' : ''}
    ${hideBottom || hideLeft ? 'border-bottom-left-radius: 0;' : ''}
    ${hideBottom || hideRight ? 'border-bottom-right-radius: 0;' : ''}
  `;
};

const inputBoxBorderRules = (
  color: string,
  options?: InputBoxBorderOptions,
): RuleSet<object> => {
  const shadow = inputBoxInsetShadow(color, options);

  return css`
    border: none;
    box-shadow: ${shadow};
    ${inputBoxBorderRadius(options)}

    &:hover:not(:focus-within):not([data-disabled]):not([data-read-only]):not(
        [data-skeleton]
      ) {
      box-shadow: ${shadow};
    }

    &:focus-within:not([data-disabled]):not([data-read-only]):not([data-skeleton]) {
      box-shadow: ${shadow};
    }
  `;
};

/**
 * Стили границы Admiral InputBox.
 * У InputBox рамка — inset box-shadow, не border.
 * Для styled(TimePicker) / styled(TimePickerInputBox).
 */
export const inputBoxBorder = (
  color: string,
  options?: InputBoxBorderOptions,
): RuleSet<object> => css`
  &&&& {
    ${inputBoxBorderRules(color, options)}
  }
`;

/**
 * Граница InputBox внутри styled(TimePickerField).
 * className у Field — на обёртке, граница — на .time-picker внутри.
 */
export const inputBoxBorderMixin = (
  color: string,
  options?: InputBoxBorderOptions,
): RuleSet<object> => css`
  &&& .time-picker {
    ${inputBoxBorderRules(color, options)}
  }
`;

/**
 * Стыковка InputBox с соседним полем: тема Admiral, скрытые стороны, focus на стыке.
 * Для TimePicker в DateTimePicker и подобных составных контролах.
 */
export const inputBoxJoin = (hide: InputBoxBorderSide[]): RuleSet<object> => css`
  &&&& {
    border: 1px solid
      ${({ theme }: { theme: DefaultTheme }) =>
        resolveInputBoxBorderColor(theme)};
    ${isSideHidden(hide, 'left') ? 'border-left: none;' : ''}
    ${isSideHidden(hide, 'right') ? 'border-right: none;' : ''}
    ${isSideHidden(hide, 'top') ? 'border-top: none;' : ''}
    ${isSideHidden(hide, 'bottom') ? 'border-bottom: none;' : ''}
    box-shadow: none;
    ${inputBoxBorderRadius({ hide })}

    &:hover:not(:focus-within):not([data-disabled]):not([data-read-only]):not(
        [data-skeleton]
      ) {
      border-color: ${({ theme }: { theme: DefaultTheme }) =>
        resolveInputBoxBorderColor(theme, 'hover')};
      ${isSideHidden(hide, 'left') ? 'border-left: none;' : ''}
      ${isSideHidden(hide, 'right') ? 'border-right: none;' : ''}
      ${isSideHidden(hide, 'top') ? 'border-top: none;' : ''}
      ${isSideHidden(hide, 'bottom') ? 'border-bottom: none;' : ''}
    }

    &:focus-within:not([data-disabled]):not([data-read-only]):not([data-skeleton]) {
      border-color: ${({ theme }: { theme: DefaultTheme }) =>
        resolveInputBoxBorderColor(theme, 'focus')};
      ${isSideHidden(hide, 'left') ? 'border-left: none;' : ''}
      ${isSideHidden(hide, 'right') ? 'border-right: none;' : ''}
      ${isSideHidden(hide, 'top') ? 'border-top: none;' : ''}
      ${isSideHidden(hide, 'bottom') ? 'border-bottom: none;' : ''}
    }
  }
`;
