import React from 'react';
import {
  HorizontalTab,
  HorizontalTabs,
  NotificationItemContent,
  NotificationItemTitle,
  TabText,
  T,
} from '@admiral-ds/react-ui';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';
import { useCronPageSearchParams } from '@features/cron/hooks/useCronPageSearchParams';
import {
  PAGE_TAB_IDS,
  type PageTabId,
} from '@features/cron/utils/cronPageSearchParams';
import { CheckerTab, ConstructorTab, EditorParamsPanels } from './components';
import * as Styled from './styles';
import { CRON_PAGE_RU_STRINGS } from './strings';
import {
  DAILY_FREQUENCY_VALUES,
  MINUTE_STEP_OPTIONS,
  REQUIRE_FIELD_VALUES,
  toggleMultiSelect,
  toggleRequireField,
} from './utils';
import {
  CronEditor,
  DEFAULT_CRON_OPTIONS,
  type CronOptions,
  type CronRequireField,
} from './components/CronEditor';
import { Cron } from './components/CronEditor/models/cron';
import type {
  DailyFrequencyType,
  OccursFrequency,
  ScheduleType,
} from './components/CronEditor/utils/scheduleTypes';
import {
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from './components/CronEditor/utils/constants';

const t = CRON_PAGE_RU_STRINGS;

export const CronPageRU: React.FC = (_props) => {
  const pageTabs = React.useMemo(
    () =>
      PAGE_TAB_IDS.map((id) => ({
        id,
        label: t.tabs[id],
      })),
    [],
  );

  const scheduleTypeOptions = React.useMemo(
    () =>
      SCHEDULE_TYPE_OPTIONS.map((option) => ({
        ...option,
        label: t.scheduleTypes[option.value],
      })),
    [],
  );

  const occursOptions = React.useMemo(
    () =>
      OCCURS_OPTIONS.map((option) => ({
        ...option,
        label: t.occurs[option.value],
      })),
    [],
  );

  const dailyFrequencyOptions = React.useMemo(
    () =>
      DAILY_FREQUENCY_VALUES.map((value) => ({
        value,
        label: t.dailyFrequencies[value],
      })),
    [],
  );

  const requireOptions = React.useMemo(
    () =>
      REQUIRE_FIELD_VALUES.map((value) => ({
        value,
        label: t.requireFields[value],
      })),
    [],
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

    return parseCronExpression(trimmed, 'ru').valid === true;
  }, [checkerExpression]);

  const editCronFromChecker = () => {
    const trimmed = checkerExpression.trim();

    if (!trimmed || parseCronExpression(trimmed, 'ru').valid === false) {
      return;
    }

    submitCron(Cron.fromString(trimmed));
    selectTab('constructor');
  };

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
        <ConstructorTab t={t}>
          <CronEditor
            value={cron}
            onChange={submitCron}
            options={editorOptions}
          />
        </ConstructorTab>
      )}

      {activeTab === 'checker' && (
        <CheckerTab
          expression={checkerExpression}
          canEditFromChecker={canEditFromChecker}
          editCronLabel={t.editCron}
          onExpressionChange={changeCheckerExpression}
          onEditCron={editCronFromChecker}
        />
      )}

      {activeTab === 'editorParams' && (
        <EditorParamsPanels
          t={t}
          editorOptions={editorOptions}
          scheduleTypeOptions={scheduleTypeOptions}
          occursOptions={occursOptions}
          dailyFrequencyOptions={dailyFrequencyOptions}
          requireOptions={requireOptions}
          minuteStepOptions={MINUTE_STEP_OPTIONS}
          onPatchScheduleTypes={patchScheduleTypes}
          onPatchOccursFrequencies={patchOccursFrequencies}
          onPatchDailyFrequencies={patchDailyFrequencies}
          onPatchMinuteStep={patchMinuteStep}
          onPatchWeeklyWeekNumbers={patchWeeklyWeekNumbers}
          onPatchShowYearNotice={patchShowYearNotice}
          onPatchRequireField={patchRequireField}
        />
      )}
    </Styled.Page>
  );
};

export default CronPageRU;
