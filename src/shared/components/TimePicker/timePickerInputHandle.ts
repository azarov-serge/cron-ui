/** Маска ввода HH:mm (логика Admiral DS defaultTimePickerHandle) */

type InputData = {
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
};

const splice = (source: string, start: number, deleteCount: number, insert = ''): string =>
  source.slice(0, start) + insert + source.slice(start + deleteCount);

const isValidDigit = (string: string, position: number): boolean => {
  const onlyDigitString = string.replace(/\D+/g, '').slice(0, 1);

  switch (position) {
    case 0:
      return /^([0-2])?$/.test(onlyDigitString);
    case 1:
    case 4:
      return /^([0-9])?$/.test(onlyDigitString);
    case 2:
      return /^([0-3])?$/.test(onlyDigitString);
    case 3:
      return /^([0-5])?$/.test(onlyDigitString);
    default:
      return false;
  }
};

/** Форматирует ввод времени в HH:mm с контролем курсора */
export const timePickerInputHandle = (inputData: InputData | null): InputData => {
  if (inputData === null) {
    return { value: '', selectionStart: 0, selectionEnd: 0 };
  }

  let value = inputData.value || '';
  const selectionStart = inputData.selectionStart || 0;
  let moveCursor = 0;
  const lengthDifference = value.length - 5;

  if (lengthDifference < 0) {
    const newChar = value.charAt(selectionStart - 1);

    if (
      selectionStart - 1 === 1 &&
      ((value[0] === '2' && isValidDigit(newChar, 2)) ||
        (value[0] !== '2' && isValidDigit(newChar, 1)))
    ) {
      value = splice(value, selectionStart, 1, '');
    } else if (
      selectionStart - 1 !== 2 &&
      selectionStart - 1 !== 1 &&
      isValidDigit(newChar, selectionStart - 1)
    ) {
      value = splice(value, selectionStart, 1, '');
    } else if (selectionStart - 1 === 0 || selectionStart - 1 === 3) {
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

  value = value.replace(/[^0-9]/g, '');
  if (value.length >= 3) {
    value = `${value.substring(0, 2)}:${value.substring(2, 4)}`;
    if (selectionStart > 2) {
      moveCursor += 1;
    }
  }

  return {
    ...inputData,
    value,
    selectionStart: selectionStart + moveCursor,
    selectionEnd: selectionStart + moveCursor,
  };
};
