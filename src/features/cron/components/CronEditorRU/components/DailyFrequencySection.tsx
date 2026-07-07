import React from 'react';
import {
  NumberInputField,
  Option,
  RadioButton,
  SelectField,
  T,
} from '@admiral-ds/react-ui';
import { TimePickerField } from '@shared/components/TimePicker';
import * as Styled from '../styles';
import {
  getDailyFrequencySchedule,
  getEveryIntervalHint,
  setDailyFrequency,
  setEveryInterval,
  setEveryUnit,
  setOnceAtTime,
  type ScheduleInterface,
} from '../utils';
import { useCronEditorConfig, useCronEditorValidation } from '../hooks';
import { EDITOR_STRINGS } from '../strings';
import { Legend } from './Legend';
import type { CronSectionProps } from './types';

export const DailyFrequencySection: React.FC<CronSectionProps> = (props) => {
  const { value, options, onChange } = props;
  const {
    showDailyFrequencyChoice,
    allowOnceDaily,
    allowEveryDaily,
    intervalUnitOptions,
  } = useCronEditorConfig(options);
  const { everyIntervalLimits, isOnceDaily, isIntervalInvalid } =
    useCronEditorValidation(value, options);
  const { onceAtTime, everyInterval, everyUnit } = getDailyFrequencySchedule(value);

  return (
    <Styled.Section>
      <Legend>Ежедневная частота</Legend>
      <Styled.FrequencyGroup>
        {allowOnceDaily && (
          <Styled.RadioRow>
            {showDailyFrequencyChoice ? (
              <Styled.RadioLabel>
                <RadioButton
                  name="dailyFrequency"
                  dimension="s"
                  value="once"
                  checked={isOnceDaily}
                  onChange={() => onChange(setDailyFrequency(value, 'once'))}
                >
                  Выполняется один раз в
                </RadioButton>
              </Styled.RadioLabel>
            ) : (
              <T font="Body/Body 1 Short" color="Neutral/Neutral 90" as="span">
                Выполняется один раз в
              </T>
            )}
            <Styled.IntervalField>
              <TimePickerField
                value={onceAtTime}
                disabled={showDailyFrequencyChoice && !isOnceDaily}
                minuteStep={options.minuteStep}
                onChange={(time) =>
                  onChange(setOnceAtTime(value, time ?? '', options.minuteStep))
                }
              />
            </Styled.IntervalField>
          </Styled.RadioRow>
        )}

        {allowEveryDaily && (
          <Styled.EveryFrequencyBlock>
            <Styled.EveryFrequencyRow>
              {showDailyFrequencyChoice ? (
                <Styled.RadioLabel>
                  <RadioButton
                    name="dailyFrequency"
                    dimension="s"
                    value="every"
                    checked={!isOnceDaily}
                    onChange={() => onChange(setDailyFrequency(value, 'every'))}
                  >
                    Выполняется каждые
                  </RadioButton>
                </Styled.RadioLabel>
              ) : (
                <T
                  font="Body/Body 1 Short"
                  color="Neutral/Neutral 90"
                  as="span"
                >
                  Выполняется каждые
                </T>
              )}
              <Styled.IntervalControls>
                <Styled.IntervalField>
                  <NumberInputField
                    dimension="s"
                    minValue={everyIntervalLimits.min}
                    maxValue={everyIntervalLimits.max}
                    precision={0}
                    step={everyIntervalLimits.step}
                    value={everyInterval}
                    status={
                      !isOnceDaily && isIntervalInvalid ? 'error' : undefined
                    }
                    onChange={(event) =>
                      onChange(
                        setEveryInterval(
                          value,
                          options.minuteStep,
                          Number(event.target.value) || 1,
                        ),
                      )
                    }
                    disabled={showDailyFrequencyChoice && isOnceDaily}
                  />
                </Styled.IntervalField>
                <Styled.UnitSelectWrap>
                  <SelectField
                    dimension="s"
                    value={everyUnit}
                    onChange={(event) =>
                      onChange(
                        setEveryUnit(
                          value,
                          options.minuteStep,
                          event.target.value as ScheduleInterface['everyUnit'],
                        ),
                      )
                    }
                    disabled={showDailyFrequencyChoice && isOnceDaily}
                  >
                    {intervalUnitOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </SelectField>
                </Styled.UnitSelectWrap>
              </Styled.IntervalControls>
            </Styled.EveryFrequencyRow>
            {!isOnceDaily && (
              <Styled.FieldHint $inSection $error={isIntervalInvalid}>
                {getEveryIntervalHint(
                  everyUnit,
                  options.minuteStep,
                  EDITOR_STRINGS,
                )}
              </Styled.FieldHint>
            )}
          </Styled.EveryFrequencyBlock>
        )}
      </Styled.FrequencyGroup>
    </Styled.Section>
  );
};
