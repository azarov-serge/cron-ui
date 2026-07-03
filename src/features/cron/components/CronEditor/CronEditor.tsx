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
import {
  WEEK_DAY_LABELS,
  WEEK_NUMBER_KEYS,
  WEEK_NUMBER_LABELS,
} from './models/schedule/types';
import {
  CRON_FORM_ID,
  getOneTimeCronYearNotice,
  INTERVAL_UNIT_OPTIONS,
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from './constants';

import {
  Form,
  DateFieldWrap,
  DescriptionSection,
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

export const Legend = styled.legend`
  width: auto;
`;

export interface CronEditorProps {
  cron?: Cron;
  onSubmit?: (cron: Cron) => void;
  options?: CronOptions;
}

export const CronEditor: React.FC<CronEditorProps> = (props) => {
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
  );
  const showOccursChoice = options.occursFrequencies.length > 1;
  const occursOptions = OCCURS_OPTIONS.filter((option) =>
    options.occursFrequencies.includes(option.value),
  );
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
      }),
    [schedule, options],
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
          <Legend>Тип расписания</Legend>
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
          <Legend>Однократное выполнение</Legend>
          <InlineRow>
            <DateFieldWrap>
              <DateField
                label="Дата"
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
                label="Время"
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
              <NotificationItemTitle>Год не входит в cron</NotificationItemTitle>
              <NotificationItemContent>
                {getOneTimeCronYearNotice(schedule.oneTimeDate)}
              </NotificationItemContent>
            </NotificationItem>
          </NoticeWrap>
        </Section>
      )}

      {isRecurring && (
        <>
          <Section>
            <Legend>Частота</Legend>
            {showOccursChoice && (
              <InlineRow>
                <T
                  font="Body/Body 1 Short"
                  color="Neutral/Neutral 90"
                  as="span"
                >
                  Выполняется
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
                  День
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
                  месяца
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
                    ? 'Дни недели'
                    : 'Дни недели (необязательно)'}
                </T>
                <WeekDaysGrid>
                  {(Object.keys(WEEK_DAY_LABELS) as WeekDayKey[]).map((day) => (
                    <CheckboxField
                      key={day}
                      checked={schedule.weekDays[day]}
                      onChange={(event) =>
                        setWeekDay(day, event.target.checked)
                      }
                    >
                      {WEEK_DAY_LABELS[day]}
                    </CheckboxField>
                  ))}
                </WeekDaysGrid>
                {isWeekDaysInvalid && (
                  <FieldHint $error $inSection>
                    Выберите хотя бы один день недели
                  </FieldHint>
                )}
                {!isCronFieldRequired(options.requires, 'weeklyWeekDays') && (
                  <FieldHint $inSection>
                    Если ничего не выбрано — каждый день недели
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
                        ? 'Недели месяца'
                        : 'Недели месяца (необязательно)'}
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
                          {`${WEEK_NUMBER_LABELS[week]} неделя`}
                        </CheckboxField>
                      ))}
                    </WeekDaysGrid>
                    {isWeekNumbersInvalid && (
                      <FieldHint $error $inSection>
                        Выберите хотя бы одну неделю месяца
                      </FieldHint>
                    )}
                    {!isCronFieldRequired(options.requires, 'weeklyWeekNumbers') && (
                      <FieldHint $inSection>
                        Если ничего не выбрано — запуск каждую неделю
                      </FieldHint>
                    )}
                  </>
                )}
              </>
            )}
          </Section>

          <Section>
            <Legend>Ежедневная частота</Legend>
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
                        Выполняется один раз в
                      </RadioButton>
                    </RadioLabel>
                  ) : (
                    <T
                      font="Body/Body 1 Short"
                      color="Neutral/Neutral 90"
                      as="span"
                    >
                      Выполняется один раз в
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
                          Выполняется каждые
                        </RadioButton>
                      </RadioLabel>
                    ) : (
                      <T
                        font="Body/Body 1 Short"
                        color="Neutral/Neutral 90"
                        as="span"
                      >
                        Выполняется каждые
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
                          {INTERVAL_UNIT_OPTIONS.map((option) => (
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
                      )}
                    </FieldHint>
                  )}
                </EveryFrequencyBlock>
              )}
            </FrequencyGroup>
          </Section>
        </>
      )}

      <DescriptionSection>
        <Legend>cron</Legend>
        <span>{schedule.toCron().toString() ?? ''}</span>
      </DescriptionSection>

      <DescriptionSection>
        <Legend>Описание</Legend>
        <span>{schedule.toDescription() ?? ''}</span>
      </DescriptionSection>
    </Form>
  );
};
