import React from 'react';
import {
  HorizontalTab,
  HorizontalTabs,
  NotificationItemContent,
  NotificationItemTitle,
  Option,
  SelectField,
  TabText,
  T,
  CheckboxField,
} from '@admiral-ds/react-ui';
import { EditOutlined } from '@ant-design/icons';
import { CronChecker } from '@features/cron/components/CronChecker';
import {
  CronEditor,
  DEFAULT_CRON_OPTIONS,
  type CronOptions,
  type CronRequireField,
} from '@features/cron/components/CronEditor';
import { useCronPageSearchParams } from '@features/cron/hooks/useCronPageSearchParams';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import type {
  DailyFrequencyType,
  OccursFrequency,
  ScheduleType,
} from '@features/cron/components/CronEditor/utils';
import {
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '@features/cron/components/CronEditor/utils';
import {
  PAGE_TAB_IDS,
  type PageTabId,
} from '@features/cron/utils/cronPageSearchParams';
import { useTranslation } from '@shared/i18n/useTranslation';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';

import * as Styled from './styles';
import {
  DAILY_FREQUENCY_VALUES,
  MINUTE_STEP_OPTIONS,
  REQUIRE_FIELD_VALUES,
  toggleMultiSelect,
  toggleRequireField,
} from './utils';
// import { DateTimeRangeField } from './components';

export const CronPage: React.FC = () => {
  const { t, locale } = useTranslation();

  const pageTabs = React.useMemo(
    () =>
      PAGE_TAB_IDS.map((id) => ({
        id,
        label: t.tabs[id],
      })),
    [t],
  );

  const scheduleTypeOptions = React.useMemo(
    () =>
      SCHEDULE_TYPE_OPTIONS.map((option) => ({
        ...option,
        label: t.scheduleTypes[option.value],
      })),
    [t],
  );

  const occursOptions = React.useMemo(
    () =>
      OCCURS_OPTIONS.map((option) => ({
        ...option,
        label: t.occurs[option.value],
      })),
    [t],
  );

  const dailyFrequencyOptions = React.useMemo(
    () =>
      DAILY_FREQUENCY_VALUES.map((value) => ({
        value,
        label: t.dailyFrequencies[value],
      })),
    [t],
  );

  const requireOptions = React.useMemo(
    () =>
      REQUIRE_FIELD_VALUES.map((value) => ({
        value,
        label: t.requireFields[value],
      })),
    [t],
  );

  const {
    activeTab,
    cron,
    checkerExpression,
    cronParamError,
    selectTab,
    changeCheckerExpression,
    submitCron,
  } = useCronPageSearchParams();

  const [editorOptions, setEditorOptions] = React.useState<
    Required<CronOptions>
  >(() => ({ ...DEFAULT_CRON_OPTIONS }));

  const canEditFromChecker = React.useMemo(() => {
    const trimmed = checkerExpression.trim();
    if (!trimmed) {
      return false;
    }
    return parseCronExpression(trimmed, locale).valid === true;
  }, [checkerExpression, locale]);

  const editCronFromChecker = () => {
    const trimmed = checkerExpression.trim();
    if (!trimmed || parseCronExpression(trimmed, locale).valid === false) {
      return;
    }

    submitCron(Cron.fromString(trimmed));
    selectTab('constructor');
  };

  const renderEditCronButton = () => (
    <Styled.EditCronButton
      appearance="primary"
      dimension="s"
      type="button"
      disabled={!canEditFromChecker}
      onClick={editCronFromChecker}
    >
      <Styled.ButtonContent>
        <EditOutlined />
        {t.editCron}
      </Styled.ButtonContent>
    </Styled.EditCronButton>
  );

  const patchScheduleTypes = (value: ScheduleType, checked: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      scheduleTypes: toggleMultiSelect(
        prevOptions.scheduleTypes,
        value,
        checked,
      ),
    }));
  };

  const patchOccursFrequencies = (value: OccursFrequency, checked: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      occursFrequencies: toggleMultiSelect(
        prevOptions.occursFrequencies,
        value,
        checked,
      ),
    }));
  };

  const patchDailyFrequencies = (
    value: DailyFrequencyType,
    checked: boolean,
  ) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      dailyFrequencies: toggleMultiSelect(
        prevOptions.dailyFrequencies,
        value,
        checked,
      ),
    }));
  };

  const patchMinuteStep = (minuteStep: number) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      minuteStep,
    }));
  };

  const patchWeeklyWeekNumbers = (weeklyWeekNumbers: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      weeklyWeekNumbers,
      requires: weeklyWeekNumbers
        ? prevOptions.requires
        : prevOptions.requires.filter((field) => field !== 'weeklyWeekNumbers'),
    }));
  };

  const patchShowYearNotice = (showYearNotice: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      showYearNotice,
    }));
  };

  const patchRequireField = (value: CronRequireField, checked: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      requires: toggleRequireField(prevOptions.requires, value, checked),
    }));
  };

  const renderCronEditor = () => (
    <CronEditor value={cron} onChange={submitCron} options={editorOptions} />
  );

  const renderPageTab = (
    tabId: string,
    selected?: boolean,
    onSelectTab?: (nextTabId: string) => void,
  ) => {
    const tab = pageTabs.find((item) => item.id === tabId);

    return (
      <HorizontalTab
        key={tabId}
        tabId={tabId}
        selected={selected}
        onSelectTab={onSelectTab}
      >
        <TabText>{tab?.label}</TabText>
      </HorizontalTab>
    );
  };
  const renderEditorParamsPanels = () => (
    <>
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
                    patchScheduleTypes(option.value, event.target.checked)
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
                    patchOccursFrequencies(option.value, event.target.checked)
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
                    patchDailyFrequencies(option.value, event.target.checked)
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
                  patchWeeklyWeekNumbers(event.target.checked)
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
                onChange={(event) => patchShowYearNotice(event.target.checked)}
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
              onChange={(event) => patchMinuteStep(Number(event.target.value))}
            >
              {MINUTE_STEP_OPTIONS.map((step) => (
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
                  patchRequireField(option.value, event.target.checked)
                }
              >
                {option.label}
              </CheckboxField>
            ))}
          </Styled.CheckboxList>
        </Styled.ControlGroup>
      </Styled.ControlsPanel>
    </>
  );

  return (
    <Styled.Page>
      <Styled.PageHeader>
        <T font="Header/H4" as="h3">
          {t.pageTitle}
        </T>
        <Styled.PageDescription
          font="Body/Body 1 Long"
          color="Neutral/Neutral 50"
          as="p"
        >
          {t.pageDescription}
        </Styled.PageDescription>
      </Styled.PageHeader>
      {/* <DateTimeRangeField /> */}
      <HorizontalTabs
        selectedTabId={activeTab}
        onSelectTab={(tabId) => selectTab(tabId as PageTabId)}
        tabsId={pageTabs.map((tab) => tab.id)}
        renderTab={renderPageTab}
        tabIsDisabled={() => false}
      />

      {cronParamError && (
        <Styled.UrlErrorNotice status="error" displayStatusIcon>
          <NotificationItemTitle>{t.urlError.title}</NotificationItemTitle>
          <NotificationItemContent>
            {cronParamError}. {t.urlError.defaultUsed} (
            {Cron.createEmpty().toExpression()}).
          </NotificationItemContent>
        </Styled.UrlErrorNotice>
      )}

      {activeTab === 'constructor' && (
        <Styled.TabContent>
          <Styled.HelpNotice status="info" displayStatusIcon>
            <NotificationItemTitle>{t.help.title}</NotificationItemTitle>
            <NotificationItemContent>
              <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>{t.help.step1}</li>
                <li>{t.help.step2}</li>
                <li>{t.help.step3}</li>
                <li>{t.help.step4}</li>
              </ol>
            </NotificationItemContent>
          </Styled.HelpNotice>

          <Styled.ConstructorEditor>
            {renderCronEditor()}
          </Styled.ConstructorEditor>
        </Styled.TabContent>
      )}

      {activeTab === 'checker' && (
        <Styled.TabContent>
          <Styled.CheckerActions>
            {renderEditCronButton()}
          </Styled.CheckerActions>
          <CronChecker
            expression={checkerExpression}
            onExpressionChange={changeCheckerExpression}
          />
          <Styled.CheckerActions>
            {renderEditCronButton()}
          </Styled.CheckerActions>
        </Styled.TabContent>
      )}

      {activeTab === 'editorParams' && (
        <Styled.TabContent>{renderEditorParamsPanels()}</Styled.TabContent>
      )}
    </Styled.Page>
  );
};

export default CronPage;
