import {
  InputBox as InputBoxUI,
  type ComponentDimension,
  typography,
} from '@admiral-ds/react-ui';
import styled, { type RuleSet } from 'styled-components';

export const Root = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const InputBox = styled(InputBoxUI)<{ $css?: RuleSet<object> }>`
  width: 100%;
  max-width: 100%;
  ${({ $css }) => $css}
`;

export const IconPanel = styled.div<{ $dimension?: ComponentDimension }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: ${({ $dimension }) => ($dimension === 's' ? 12 : 16)}px;
  pointer-events: auto;
`;

export const Panel = styled.div`
  display: flex;
  width: max-content;
`;

export const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 56px;

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  }
`;

export const ColumnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 224px;
  overflow-y: auto;
  overscroll-behavior: contain;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ColumnItem = styled.li``;

export const OptionButton = styled.button<{ $selected?: boolean }>`
  ${typography['Body/Body 1 Long']};
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: ${({ $selected, theme }) =>
    $selected ? theme.color['Primary/Primary 10'] : 'transparent'};
  color: ${({ $selected, theme }) =>
    $selected
      ? theme.color['Primary/Primary 60 Main']
      : theme.color['Neutral/Neutral 90']};
  cursor: pointer;
  text-align: center;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected
        ? theme.color['Primary/Primary 10']
        : theme.color['Neutral/Neutral 10']};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color['Primary/Primary 60 Main']};
    outline-offset: -2px;
  }
`;
