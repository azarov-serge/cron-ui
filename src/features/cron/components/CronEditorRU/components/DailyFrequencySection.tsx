import {
  NumberInputField,
  Option,
  RadioButton,
  SelectField,
  T,
} from '@admiral-ds/react-ui';
import type { ScheduleInterface } from '../models/schedule/types';
import {
  patchEveryInterval,
  patchEveryUnit,
  useCronEditorStore,
} from '../hooks/useCronEditorStore';
import {
  EveryFrequencyBlock,
  EveryFrequencyRow,
  FieldHint,
  FrequencyGroup,
  IntervalControls,
  IntervalField,
  RadioLabel,
  RadioRow,
  Section,
  UnitSelectWrap,
} from '../styles';
import { Legend } from './Legend';
import { TimePickerField } from '@shared/components/TimePicker';
import { useCronEditorConfig } from '../hooks/useCronEditorConfig';
import { useCronEditorValidation } from '../hooks/useCronEditorValidation';
import { getEveryIntervalHint } from '../utils/validation';
import { editorStrings } from '../strings';

export const DailyFrequencySection = () => {
  const {
    showDailyFrequencyChoice,
    allowOnceDaily,
    allowEveryDaily,
    intervalUnitOptions,
    options,
  } = useCronEditorConfig();
  const { everyIntervalLimits, isOnceDaily, isIntervalInvalid } =
    useCronEditorValidation();

  const onceAtTime = useCronEditorStore((state) => state.schedule.onceAtTime);
  const everyInterval = useCronEditorStore(
    (state) => state.schedule.everyInterval,
  );
  const everyUnit = useCronEditorStore((state) => state.schedule.everyUnit);
  const patchSchedule = useCronEditorStore((state) => state.patchSchedule);
  const patchTime = useCronEditorStore((state) => state.patchTime);

  return (
    <Section>
      <Legend>{editorStrings.dailyFrequency}</Legend>
      <FrequencyGroup>
        {allowOnceDaily && (
          <RadioRow>
            {showDailyFrequencyChoice ? (
              <RadioLabel>
                <RadioButton
                  name="dailyFrequency"
                  dimension="s"
                  value="once"
                  checked={isOnceDaily}
                  onChange={() => patchSchedule({ dailyFrequency: 'once' })}
                >
                  {editorStrings.onceAt}
                </RadioButton>
              </RadioLabel>
            ) : (
              <T font="Body/Body 1 Short" color="Neutral/Neutral 90" as="span">
                {editorStrings.onceAt}
              </T>
            )}
            <IntervalField>
              <TimePickerField
                value={onceAtTime}
                disabled={showDailyFrequencyChoice && !isOnceDaily}
                minuteStep={options.minuteStep}
                onChange={(time) => patchTime('onceAtTime', time)}
              />
            </IntervalField>
          </RadioRow>
        )}

        {allowEveryDaily && (
          <EveryFrequencyBlock>
            <EveryFrequencyRow>
              {showDailyFrequencyChoice ? (
                <RadioLabel>
                  <RadioButton
                    name="dailyFrequency"
                    dimension="s"
                    value="every"
                    checked={!isOnceDaily}
                    onChange={() => patchSchedule({ dailyFrequency: 'every' })}
                  >
                    {editorStrings.every}
                  </RadioButton>
                </RadioLabel>
              ) : (
                <T font="Body/Body 1 Short" color="Neutral/Neutral 90" as="span">
                  {editorStrings.every}
                </T>
              )}
              <IntervalControls>
                <IntervalField>
                  <NumberInputField
                    dimension="s"
                    minValue={everyIntervalLimits.min}
                    maxValue={everyIntervalLimits.max}
                    precision={0}
                    step={everyIntervalLimits.step}
                    value={everyInterval}
                    status={!isOnceDaily && isIntervalInvalid ? 'error' : undefined}
                    onChange={(event) =>
                      patchSchedule((schedule) =>
                        patchEveryInterval(
                          schedule,
                          options.minuteStep,
                          Number(event.target.value) || 1,
                        ),
                      )
                    }
                    disabled={showDailyFrequencyChoice && isOnceDaily}
                  />
                </IntervalField>
                <UnitSelectWrap>
                  <SelectField
                    dimension="s"
                    value={everyUnit}
                    onChange={(event) =>
                      patchSchedule((schedule) =>
                        patchEveryUnit(
                          schedule,
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
                </UnitSelectWrap>
              </IntervalControls>
            </EveryFrequencyRow>
            {!isOnceDaily && (
              <FieldHint $inSection $error={isIntervalInvalid}>
                {getEveryIntervalHint(
                  everyUnit,
                  options.minuteStep,
                )}
              </FieldHint>
            )}
          </EveryFrequencyBlock>
        )}
      </FrequencyGroup>
    </Section>
  );
};
