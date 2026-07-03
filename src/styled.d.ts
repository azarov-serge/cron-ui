import 'styled-components';
import type { Theme } from '@admiral-ds/react-ui';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
