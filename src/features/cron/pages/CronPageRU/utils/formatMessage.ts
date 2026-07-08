export const formatMessage = (
  template: string,
  values: Record<string, string | number>,
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ''),
  );

