/** Маска ввода HH:mm / HH:mm:ss (логика Admiral DS defaultTimePickerHandle) */

type InputData = {
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
};

const splice = (source: string, start: number, deleteCount: number, insert = ''): string =>
  source.slice(0, start) + insert + source.slice(start + deleteCount);

const isValidDigit = (string: string, position: number, withSeconds: boolean): boolean => {
  const onlyDigitString = string.replace(/\D+/g, '').slice(0, 1);

  switch (position) {
    case 0:
      return /^([0-2])?$/.test(onlyDigitString);
    case 1:
    case 4:
    case 7:
      return /^([0-9])?$/.test(onlyDigitString);
    case 2:
      return /^([0-3])?$/.test(onlyDigitString);
    case 3:
    case 6:
      return /^([0-5])?$/.test(onlyDigitString);
    case 5:
      return withSeconds ? /^([0-5])?$/.test(onlyDigitString) : false;
    default:
      return false;
  }
};

const formatTimeValue = (digits: string, withSeconds: boolean): string => {
  if (withSeconds) {
    if (digits.length >= 5) {
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
    }

    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }

    return digits;
  }

  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }

  return digits;
};

/** Форматирует ввод времени в HH:mm[:ss] с контролем курсора */
export const timePickerInputHandle = (
  inputData: InputData | null,
  withSeconds = false,
): InputData => {
  if (inputData === null) {
    return { value: '', selectionStart: 0, selectionEnd: 0 };
  }

  const targetLength = withSeconds ? 8 : 5;
  let value = inputData.value || '';
  const selectionStart = inputData.selectionStart || 0;
  let moveCursor = 0;
  const lengthDifference = value.length - targetLength;

  if (lengthDifference < 0) {
    const newChar = value.charAt(selectionStart - 1);

    if (
      selectionStart - 1 === 1 &&
      ((value[0] === '2' && isValidDigit(newChar, 2, withSeconds)) ||
        (value[0] !== '2' && isValidDigit(newChar, 1, withSeconds)))
    ) {
      value = splice(value, selectionStart, 1, '');
    } else if (
      selectionStart - 1 !== 2 &&
      selectionStart - 1 !== 1 &&
      isValidDigit(newChar, selectionStart - 1, withSeconds)
    ) {
      value = splice(value, selectionStart, 1, '');
    } else if (
      selectionStart - 1 === 0 ||
      selectionStart - 1 === 3 ||
      (withSeconds && selectionStart - 1 === 6)
    ) {
      value = splice(value, selectionStart - 1, 1, `0${newChar}`);
      moveCursor += 1;
    } else if (selectionStart - 1 !== 2) {
      value = splice(value, selectionStart - 1, 1, '');
      moveCursor -= 1;
    }
  }

  if (lengthDifference > 0) {
    value = splice(value, selectionStart, 0, '');

    if (selectionStart > 0 && value.charAt(selectionStart - 1) === ':') {
      value = splice(value, selectionStart - 1, 1, '');
      moveCursor -= 1;
    }
  }

  const digits = value.replace(/[^0-9]/g, '');
  value = formatTimeValue(digits, withSeconds);

  if (withSeconds && digits.length > 2 && selectionStart > 2) {
    moveCursor += 1;
  }

  if (withSeconds && digits.length > 4 && selectionStart > 5) {
    moveCursor += 1;
  }

  if (!withSeconds && digits.length >= 3 && selectionStart > 2) {
    moveCursor += 1;
  }

  return {
    ...inputData,
    value,
    selectionStart: selectionStart + moveCursor,
    selectionEnd: selectionStart + moveCursor,
  };
};
