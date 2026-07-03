import {
  CheckboxField,
  DateField,
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
  NumberInputField,
  Option,
  RadioButton,
  SelectField,
  T,
} from '@admiral-ds/react-ui';
import { Cron } from './models/cron';
import type { ScheduleInterface, WeekDayKey, WeekNumberKey } from './models/schedule/types';
import { WEEK_NUMBER_KEYS } from './models/schedule/types';
import {
  CRON_FORM_ID,
  INTERVAL_UNIT_OPTIONS,
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from './constants';

import {
  Form,
  DateFieldWrap,
  FrequencyGroup,
  FieldHint,
  InlineRow,
  IntervalControls,
  IntervalField,
  EveryFrequencyBlock,
  EveryFrequencyRow,
  NoticeWrap,
  NarrowField,
  RadioLabel,
  RadioRow,
  Section,
  TimeFieldWrap,
  UnitSelectWrap,
  WeekDaysGrid,
} from './styles';
import React from 'react';
import { ScheduleModel } from './models/schedule';
import { TimePickerField } from '@shared/components/TimePicker';
import { normalizeTimeToMinuteStep } from '@shared/utils/time';
import { applyCronOptions } from './applyCronOptions';
import { resolveCronOptions, type CronOptions, isCronFieldRequired } from './options';
import {
  getEveryIntervalHint,
  getEveryIntervalLimits,
  normalizeEveryInterval,
  validateSchedule,
} from './validation';
import styled from 'styled-components';
import { useTranslation } from '@shared/i18n/useTranslation';
import { getOneTimeYearNotice } from '@shared/i18n/messages';
import { CronDescriptionField, CronExpressionField } from '../CronFields';

export const Legend = styled.legend`
  width: auto;
`;

export interface CronEditorProps {
  cron?: Cron;
  onSubmit?: (cron: Cron) => void;
  options?: CronOptions;
}

export const CronEditor: React.FC<CronEditorProps> = (props) => {
  const { t, locale } = useTranslation();
  const { cron, onSubmit } = props;
  const options = React.useMemo(
    () => resolveCronOptions(props.options),
    [props.options],
  );

  const [schedule, setSchedule] = React.useState(() =>
    applyCronOptions(
      ScheduleModel.fromCron(cron ?? Cron.createEmpty()),
      options,
    ),
  );

  React.useEffect(() => {
    setSchedule((current) => applyCronOptions(current, options));
  }, [options]);

  const showScheduleTypeChoice = options.scheduleTypes.length > 1;
  const scheduleTypeOptions = SCHEDULE_TYPE_OPTIONS.filter((option) =>
    options.scheduleTypes.includes(option.value),
  ).map((option) => ({
    ...option,
    label: t.scheduleTypes[option.value],
  }));
  const showOccursChoice = options.occursFrequencies.length > 1;
  const occursOptions = OCCURS_OPTIONS.filter((option) =>
    options.occursFrequencies.includes(option.value),
  ).map((option) => ({
    ...option,
    label: t.occurs[option.value],
  }));
  const intervalUnitOptions = INTERVAL_UNIT_OPTIONS.map((option) => ({
    ...option,
    label: t.editor.intervalUnits[option.value],
  }));
  const weekDayKeys = Object.keys(t.editor.weekDaysLabels) as WeekDayKey[];
  const showDailyFrequencyChoice = options.dailyFrequencies.length > 1;
  const allowOnceDaily = options.dailyFrequencies.includes('once');
  const allowEveryDaily = options.dailyFrequencies.includes('every');

  const patchTime = (
    field: 'oneTimeTime' | 'onceAtTime',
    timeValue: string,
  ) => {
    setSchedule((prevSchedule) =>
      prevSchedule.clone({
        [field]: normalizeTimeToMinuteStep(timeValue, options.minuteStep),
      }),
    );
  };

  const isRecurring = schedule.scheduleType === 'recurring';
  const isOnceDaily = schedule.dailyFrequency === 'once';
  const everyIntervalLimits = getEveryIntervalLimits(
    schedule.everyUnit,
    options.minuteStep,
  );

  const isIntervalInvalid =
    schedule.dailyFrequency === 'every' &&
    (schedule.everyInterval < everyIntervalLimits.min ||
      schedule.everyInterval > everyIntervalLimits.max);

  const isWeekDaysInvalid =
    isCronFieldRequired(options.requires, 'weeklyWeekDays') &&
    schedule.occurs === 'weekly' &&
    !Object.values(schedule.weekDays).some(Boolean);

  const isWeekNumbersInvalid =
    isCronFieldRequired(options.requires, 'weeklyWeekNumbers') &&
    options.weeklyWeekNumbers &&
    schedule.occurs === 'weekly' &&
    schedule.useMonthWeekNumbers &&
    !WEEK_NUMBER_KEYS.some((week) => schedule.weekNumbers[week]);

  const validation = React.useMemo(
    () =>
      validateSchedule(schedule, options.minuteStep, {
        requires: options.requires,
        weeklyWeekNumbers: options.weeklyWeekNumbers,
      }, t.editor),
    [schedule, options, t.editor],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validation.valid) {
      return;
    }
    onSubmit?.(applyCronOptions(schedule, options).toCron());
  };

  const setWeekDay = (day: WeekDayKey, checked: boolean) => {
    setSchedule((prevSchedule) =>
      prevSchedule.clone({
        weekDays: { ...prevSchedule.weekDays, [day]: checked },
      }),
    );
  };

  const setWeekNumber = (week: WeekNumberKey, checked: boolean) => {
    setSchedule((prevSchedule) =>
      prevSchedule.clone({
        weekNumbers: { ...prevSchedule.weekNumbers, [week]: checked },
      }),
    );
  };


  return (
    <Form id={CRON_FORM_ID} onSubmit={handleSubmit}>
      {showScheduleTypeChoice && (
        <Section>
          <Legend>{t.editor.scheduleTypeLegend}</Legend>
          <InlineRow>
            {scheduleTypeOptions.map((option) => (
              <RadioButton
                key={option.value}
                name="scheduleType"
                value={option.value}
                checked={schedule.scheduleType === option.value}
                onChange={() =>
                  setSchedule((prevSchedule) =>
                    applyCronOptions(
                      prevSchedule.clone({ scheduleType: option.value }),
                      options,
                    ),
                  )
                }
              >
                {option.label}
              </RadioButton>
            ))}
          </InlineRow>
        </Section>
      )}

      {schedule.scheduleType === 'one-time' && (
        <Section>
          <Legend>{t.editor.oneTimeSection}</Legend>
          <InlineRow>
            <DateFieldWrap>
              <DateField
                label={t.editor.date}
                value={schedule.oneTimeDate}
                onChange={(event) =>
                  setSchedule((prevSchedule) =>
                    prevSchedule.clone({ oneTimeDate: event.target.value }),
                  )
                }
              />
            </DateFieldWrap>
            <TimeFieldWrap>
              <TimePickerField
                label={t.editor.time}
                value={schedule.oneTimeTime}
                minuteStep={options.minuteStep}
                onChange={(oneTimeTime) =>
                  patchTime('oneTimeTime', oneTimeTime)
                }
              />
            </TimeFieldWrap>
          </InlineRow>
          <NoticeWrap>
            <NotificationItem status="warning" displayStatusIcon>
              <NotificationItemTitle>{t.editor.yearNotInCronTitle}</NotificationItemTitle>
              <NotificationItemContent>
                {getOneTimeYearNotice(schedule.oneTimeDate, t)}
              </NotificationItemContent>
            </NotificationItem>
          </NoticeWrap>
        </Section>
      )}

      {isRecurring && (
        <>
          <Section>
            <Legend>{t.editor.frequency}</Legend>
            {showOccursChoice && (
              <InlineRow>
                <T
                  font="Body/Body 1 Short"
                  color="Neutral/Neutral 90"
                  as="span"
                >
                  {t.editor.occurs}
                </T>
                <SelectField
                  value={schedule.occurs}
                  onChange={(event) =>
                    setSchedule((prevSchedule) =>
                      prevSchedule.clone({
                        occurs: event.target
                          .value as ScheduleInterface['occurs'],
                      }),
                    )
                  }
                >
                  {occursOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </SelectField>
              </InlineRow>
            )}

            {schedule.occurs === 'monthly' && (
              <InlineRow style={{ marginTop: 12 }}>
                <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
                  {t.editor.day}
                </T>
                <NarrowField>
                  <NumberInputField
                    minValue={1}
                    maxValue={31}
                    precision={0}
                    value={schedule.dayOfMonth}
                    onChange={(event) =>
                      setSchedule((prevSchedule) =>
                        prevSchedule.clone({
                          dayOfMonth: Number(event.target.value) || 1,
                        }),
                      )
                    }
                  />
                </NarrowField>
                <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
                  {t.editor.ofMonth}
                </T>
              </InlineRow>
            )}

            {schedule.occurs === 'weekly' && (
              <>
                <T
                  font="Body/Body 2 Short"
                  color="Neutral/Neutral 50"
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  {isCronFieldRequired(options.requires, 'weeklyWeekDays')
                    ? t.editor.weekDays
                    : t.editor.weekDaysOptional}
                </T>
                <WeekDaysGrid>
                  {weekDayKeys.map((day) => (
                    <CheckboxField
                      key={day}
                      checked={schedule.weekDays[day]}
                      onChange={(event) =>
                        setWeekDay(day, event.target.checked)
                      }
                    >
                      {t.editor.weekDaysLabels[day]}
                    </CheckboxField>
                  ))}
                </WeekDaysGrid>
                {isWeekDaysInvalid && (
                  <FieldHint $error $inSection>
                    {t.editor.pickWeekDay}
                  </FieldHint>
                )}
                {!isCronFieldRequired(options.requires, 'weeklyWeekDays') && (
                  <FieldHint $inSection>
                    {t.editor.weekDaysEmptyHint}
                  </FieldHint>
                )}

                {options.weeklyWeekNumbers && (
                  <>
                    <T
                      font="Body/Body 2 Short"
                      color="Neutral/Neutral 50"
                      style={{ display: 'block', marginTop: 16 }}
                    >
                      {isCronFieldRequired(options.requires, 'weeklyWeekNumbers')
                        ? t.editor.weekNumbers
                        : t.editor.weekNumbersOptional}
                    </T>
                    <WeekDaysGrid>
                      {WEEK_NUMBER_KEYS.map((week) => (
                        <CheckboxField
                          key={week}
                          checked={schedule.weekNumbers[week]}
                          onChange={(event) =>
                            setWeekNumber(week, event.target.checked)
                          }
                        >
                          {`${t.editor.weekNumbersLabels[week]} ${t.editor.weekNumberSuffix}`}
                        </CheckboxField>
                      ))}
                    </WeekDaysGrid>
                    {isWeekNumbersInvalid && (
                      <FieldHint $error $inSection>
                        {t.editor.pickWeekNumber}
                      </FieldHint>
                    )}
                    {!isCronFieldRequired(options.requires, 'weeklyWeekNumbers') && (
                      <FieldHint $inSection>
                        {t.editor.weekNumbersEmptyHint}
                      </FieldHint>
                    )}
                  </>
                )}
              </>
            )}
          </Section>

          <Section>
            <Legend>{t.editor.dailyFrequency}</Legend>
            <FrequencyGroup>
              {allowOnceDaily && (
                <RadioRow>
                  {showDailyFrequencyChoice ? (
                    <RadioLabel>
                      <RadioButton
                        name="dailyFrequency"
                        value="once"
                        checked={isOnceDaily}
                        onChange={() =>
                          setSchedule((prevSchedule) =>
                            prevSchedule.clone({ dailyFrequency: 'once' }),
                          )
                        }
                      >
                        {t.editor.onceAt}
                      </RadioButton>
                    </RadioLabel>
                  ) : (
                    <T
                      font="Body/Body 1 Short"
                      color="Neutral/Neutral 90"
                      as="span"
                    >
                      {t.editor.onceAt}
                    </T>
                  )}
                  <IntervalField>
                    <TimePickerField
                      value={schedule.onceAtTime}
                      disabled={showDailyFrequencyChoice && !isOnceDaily}
                      minuteStep={options.minuteStep}
                      onChange={(onceAtTime) =>
                        patchTime('onceAtTime', onceAtTime)
                      }
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
                          value="every"
                          checked={!isOnceDaily}
                          onChange={() =>
                            setSchedule((prevSchedule) =>
                              prevSchedule.clone({
                                dailyFrequency: 'every',
                              }),
                            )
                          }
                        >
                          {t.editor.every}
                        </RadioButton>
                      </RadioLabel>
                    ) : (
                      <T
                        font="Body/Body 1 Short"
                        color="Neutral/Neutral 90"
                        as="span"
                      >
                        {t.editor.every}
                      </T>
                    )}
                    <IntervalControls>
                      <IntervalField>
                        <NumberInputField
                          minValue={everyIntervalLimits.min}
                          maxValue={everyIntervalLimits.max}
                          precision={0}
                          step={everyIntervalLimits.step}
                          value={schedule.everyInterval}
                          status={
                            !isOnceDaily && isIntervalInvalid
                              ? 'error'
                              : undefined
                          }
                          onChange={(event) =>
                            setSchedule((prevSchedule) =>
                              prevSchedule.clone({
                                everyInterval: normalizeEveryInterval(
                                  Number(event.target.value) || 1,
                                  prevSchedule.everyUnit,
                                  options.minuteStep,
                                ),
                              }),
                            )
                          }
                          disabled={showDailyFrequencyChoice && isOnceDaily}
                        />
                      </IntervalField>
                      <UnitSelectWrap>
                        <SelectField
                          value={schedule.everyUnit}
                          onChange={(event) =>
                            setSchedule((prevSchedule) => {
                              const everyUnit = event.target
                                .value as ScheduleInterface['everyUnit'];
                              const everyInterval = normalizeEveryInterval(
                                prevSchedule.everyInterval,
                                everyUnit,
                                options.minuteStep,
                              );

                              return prevSchedule.clone({
                                everyUnit,
                                everyInterval,
                              });
                            })
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
                        schedule.everyUnit,
                        options.minuteStep,
                        t.editor,
                      )}
                    </FieldHint>
                  )}
                </EveryFrequencyBlock>
              )}
            </FrequencyGroup>
          </Section>
        </>
      )}

      <CronExpressionField expression={schedule.toCron().toExpression()} />
      <CronDescriptionField description={schedule.toDescription(locale) ?? ''} />
    </Form>
  );
};
