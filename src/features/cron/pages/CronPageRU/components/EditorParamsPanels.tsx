import React from 'react';
import { CheckboxField, Option, SelectField, T } from '@admiral-ds/react-ui';
import type { CronOptions, CronRequireField } from './CronEditor';
import type {
  DailyFrequencyType,
  OccursFrequency,
  ScheduleType,
} from './CronEditor/utils/scheduleTypes';
import * as Styled from '../styles';
import type { CronPageRUStrings } from '../strings';

type ScheduleTypeOption = {
  value: ScheduleType;
  label: string;
};

type OccursOption = {
  value: OccursFrequency;
  label: string;
};

type DailyFrequencyOption = {
  value: DailyFrequencyType;
  label: string;
};

type RequireOption = {
  value: CronRequireField;
  label: string;
};

export interface EditorParamsPanelsProps {
  t: CronPageRUStrings;
  editorOptions: Required<CronOptions>;
  scheduleTypeOptions: ScheduleTypeOption[];
  occursOptions: OccursOption[];
  dailyFrequencyOptions: DailyFrequencyOption[];
  requireOptions: RequireOption[];
  minuteStepOptions: readonly number[];
  onPatchScheduleTypes: (value: ScheduleType, checked: boolean) => void;
  onPatchOccursFrequencies: (value: OccursFrequency, checked: boolean) => void;
  onPatchDailyFrequencies: (
    value: DailyFrequencyType,
    checked: boolean,
  ) => void;
  onPatchMinuteStep: (minuteStep: number) => void;
  onPatchWeeklyWeekNumbers: (weeklyWeekNumbers: boolean) => void;
  onPatchShowYearNotice: (showYearNotice: boolean) => void;
  onPatchRequireField: (value: CronRequireField, checked: boolean) => void;
}

export const EditorParamsPanels: React.FC<EditorParamsPanelsProps> = (
  props,
) => {
  const {
    t,
    editorOptions,
    scheduleTypeOptions,
    occursOptions,
    dailyFrequencyOptions,
    requireOptions,
    minuteStepOptions,
    onPatchScheduleTypes,
    onPatchOccursFrequencies,
    onPatchDailyFrequencies,
    onPatchMinuteStep,
    onPatchWeeklyWeekNumbers,
    onPatchShowYearNotice,
    onPatchRequireField,
  } = props;

  return (
    <Styled.TabContent>
      <Styled.ControlsPanel>
        <Styled.Legend>{t.editorParams}</Styled.Legend>
        <Styled.ParamsHint font="Body/Body 2 Long" color="Neutral/Neutral 50">
          {t.editorParamsHint}
        </Styled.ParamsHint>
        <Styled.ControlsGrid>
          <Styled.ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.scheduleType}
            </T>
            <Styled.CheckboxList>
              {scheduleTypeOptions.map((option) => (
                <CheckboxField
                  key={option.value}
                  dimension="s"
                  checked={editorOptions.scheduleTypes.includes(option.value)}
                  onChange={(event) =>
                    onPatchScheduleTypes(option.value, event.target.checked)
                  }
                >
                  {option.label}
                </CheckboxField>
              ))}
            </Styled.CheckboxList>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.occursFrequency}
            </T>
            <Styled.CheckboxList>
              {occursOptions.map((option) => (
                <CheckboxField
                  key={option.value}
                  dimension="s"
                  checked={editorOptions.occursFrequencies.includes(
                    option.value,
                  )}
                  onChange={(event) =>
                    onPatchOccursFrequencies(option.value, event.target.checked)
                  }
                >
                  {option.label}
                </CheckboxField>
              ))}
            </Styled.CheckboxList>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.dailyFrequency}
            </T>
            <Styled.CheckboxList>
              {dailyFrequencyOptions.map((option) => (
                <CheckboxField
                  key={option.value}
                  dimension="s"
                  checked={editorOptions.dailyFrequencies.includes(
                    option.value,
                  )}
                  onChange={(event) =>
                    onPatchDailyFrequencies(option.value, event.target.checked)
                  }
                >
                  {option.label}
                </CheckboxField>
              ))}
            </Styled.CheckboxList>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.weeklySection}
            </T>
            <Styled.CheckboxList>
              <CheckboxField
                dimension="s"
                checked={editorOptions.weeklyWeekNumbers}
                onChange={(event) =>
                  onPatchWeeklyWeekNumbers(event.target.checked)
                }
              >
                {t.showMonthWeeks}
              </CheckboxField>
            </Styled.CheckboxList>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.oneTimeSection}
            </T>
            <Styled.CheckboxList>
              <CheckboxField
                dimension="s"
                checked={editorOptions.showYearNotice}
                onChange={(event) =>
                  onPatchShowYearNotice(event.target.checked)
                }
              >
                {t.showYearNotice}
              </CheckboxField>
            </Styled.CheckboxList>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <SelectField
              dimension="s"
              label={t.minuteStep}
              value={String(editorOptions.minuteStep)}
              onChange={(event) =>
                onPatchMinuteStep(Number(event.target.value))
              }
            >
              {minuteStepOptions.map((step) => (
                <Option key={step} value={String(step)}>
                  {step}
                </Option>
              ))}
            </SelectField>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
              {t.minuteStepHint}
            </T>
          </Styled.ControlGroup>
        </Styled.ControlsGrid>
      </Styled.ControlsPanel>

      <Styled.ControlsPanel>
        <Styled.Legend>{t.requiredFields}</Styled.Legend>
        <Styled.ControlGroup>
          <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
            {t.requiredFieldsHint}
          </T>
          <Styled.CheckboxList>
            {requireOptions.map((option) => (
              <CheckboxField
                key={option.value}
                dimension="s"
                checked={editorOptions.requires.includes(option.value)}
                disabled={
                  option.value === 'weeklyWeekNumbers' &&
                  !editorOptions.weeklyWeekNumbers
                }
                onChange={(event) =>
                  onPatchRequireField(option.value, event.target.checked)
                }
              >
                {option.label}
              </CheckboxField>
            ))}
          </Styled.CheckboxList>
        </Styled.ControlGroup>
      </Styled.ControlsPanel>
    </Styled.TabContent>
  );
};
