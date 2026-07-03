import { useMemo, useState, type FC } from 'react';
import styled from 'styled-components';
import {
  HorizontalTab,
  HorizontalTabs,
  Modal,
  ModalButtonPanel,
  ModalContent,
  ModalTitle,
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
  Option,
  SelectField,
  TabText,
  T,
  Button,
  CheckboxField,
} from '@admiral-ds/react-ui';
import { CronChecker } from '@features/cron/components/CronChecker';
import {
  CronEditor,
  CRON_FORM_ID,
  DEFAULT_CRON_OPTIONS,
  type CronOptions,
  type CronRequireField,
} from '@features/cron/components/CronEditor';
import {
  CronDescriptionField,
  CronExpressionField,
} from '@features/cron/components/CronFields';
import { useCronPageSearchParams } from '@features/cron/hooks/useCronPageSearchParams';
import { Cron } from '@features/cron/components/CronEditor/models/cron';
import type {
  DailyFrequencyType,
  OccursFrequency,
  ScheduleType,
} from '@features/cron/components/CronEditor/models/schedule/types';
import {
  OCCURS_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
} from '@features/cron/components/CronEditor/constants';
import {
  PAGE_TAB_IDS,
  type PageTabId,
} from '@features/cron/utils/cronPageSearchParams';
import { EditOutlined } from '@ant-design/icons';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import { useTranslation } from '@shared/i18n/useTranslation';
import { describeCronHuman } from '@features/cron/utils/describeCron';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';

const Page = styled.main`
  width: 100%;
  padding: 48px 24px;
  min-width: 0;
  overflow-x: hidden;

  @media (max-width: 767px) {
    padding: 16px 12px;
  }
`;

const PageDescription = styled(T)`
  display: block;
  margin-top: 8px;
  max-width: 720px;
`;

const CronSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const CronSummaryFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

const CronActions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const CheckerActions = styled(CronActions)`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
    margin-top: 16px;
  }
`;

const EditScheduleButton = styled(Button)`
  flex: 1;
  justify-content: center;

  @media (min-width: 768px) {
    flex: initial;
    min-width: 200px;
  }
`;

const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
`;

const HelpNotice = styled(NotificationItem)`
  margin-top: 16px;
`;

const ParamsHint = styled(T)`
  display: block;
  margin-bottom: 12px;
`;

const MobileEditorOnly = styled.div`
  min-width: 0;
  max-width: 100%;
`;

const EditorActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const ControlsPanel = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  border-radius: 4px;
  margin: 24px 0;
  padding: 12px 16px 16px;

  legend {
    padding: 0 6px;
    color: ${({ theme }) => theme.color['Neutral/Neutral 50']};
    font-size: 13px;
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px 24px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Legend = styled.legend`
  width: auto;
`;

const TabContent = styled.div`
  margin-top: 24px;
  min-width: 0;
  max-width: 100%;
`;

const UrlErrorNotice = styled(NotificationItem)`
  margin-top: 16px;
`;

const MINUTE_STEP_OPTIONS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;

const DAILY_FREQUENCY_VALUES = ['once', 'every'] as const;

const REQUIRE_FIELD_VALUES = [
  'weeklyWeekDays',
  'weeklyWeekNumbers',
] as const satisfies readonly CronRequireField[];

const toggleMultiSelect = <OptionValue extends string>(
  selectedValues: OptionValue[],
  value: OptionValue,
  checked: boolean,
): OptionValue[] => {
  if (checked) {
    if (selectedValues.includes(value)) {
      return selectedValues;
    }
    return [...selectedValues, value];
  }
  if (selectedValues.length <= 1) {
    return selectedValues;
  }
  return selectedValues.filter((item) => item !== value);
};

const toggleRequireField = (
  selectedValues: CronRequireField[],
  value: CronRequireField,
  checked: boolean,
): CronRequireField[] => {
  if (checked) {
    if (selectedValues.includes(value)) {
      return selectedValues;
    }
    return [...selectedValues, value];
  }
  return selectedValues.filter((item) => item !== value);
};

export const CronPage: FC = (_props) => {
  const { t, locale } = useTranslation();
  const pageTabs = useMemo(
    () =>
      PAGE_TAB_IDS.map((id) => ({
        id,
        label: t.tabs[id],
      })),
    [t],
  );
  const scheduleTypeOptions = useMemo(
    () =>
      SCHEDULE_TYPE_OPTIONS.map((option) => ({
        ...option,
        label: t.scheduleTypes[option.value],
      })),
    [t],
  );
  const occursOptions = useMemo(
    () =>
      OCCURS_OPTIONS.map((option) => ({
        ...option,
        label: t.occurs[option.value],
      })),
    [t],
  );
  const dailyFrequencyOptions = useMemo(
    () =>
      DAILY_FREQUENCY_VALUES.map((value) => ({
        value,
        label: t.dailyFrequencies[value],
      })),
    [t],
  );
  const requireOptions = useMemo(
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

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [editorOptions, setEditorOptions] = useState<Required<CronOptions>>(
    () => ({ ...DEFAULT_CRON_OPTIONS }),
  );

  const openEditor = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const handleSubmit = (nextCron: Cron) => {
    submitCron(nextCron);
    closeEditor();
  };

  const handleEditorOk = () => {
    const cronForm = document.getElementById(CRON_FORM_ID);
    if (cronForm instanceof HTMLFormElement) {
      cronForm.requestSubmit();
    }
  };

  const canEditFromChecker = useMemo(() => {
    const trimmed = checkerExpression.trim();
    if (!trimmed) {
      return false;
    }
    return parseCronExpression(trimmed, locale).valid;
  }, [checkerExpression, locale]);

  const editCronFromChecker = () => {
    const trimmed = checkerExpression.trim();
    if (!trimmed || !parseCronExpression(trimmed, locale).valid) {
      return;
    }
    submitCron(Cron.fromString(trimmed));
    setIsEditorOpen(true);
  };

  const renderEditCronButton = () => (
    <EditScheduleButton
      appearance="primary"
      dimension="m"
      type="button"
      disabled={!canEditFromChecker}
      onClick={editCronFromChecker}
    >
      <ButtonContent>
        <EditOutlined />
        {t.editCron}
      </ButtonContent>
    </EditScheduleButton>
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

  const patchRequireField = (value: CronRequireField, checked: boolean) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      requires: toggleRequireField(prevOptions.requires, value, checked),
    }));
  };

  const renderEditorActions = () => (
    <>
      <Button
        appearance="primary"
        dimension="m"
        type="button"
        onClick={handleEditorOk}
      >
        {t.saveSchedule}
      </Button>
      <Button appearance="secondary" dimension="m" onClick={closeEditor}>
        {t.cancel}
      </Button>
    </>
  );

  const renderCronEditor = () => (
    <CronEditor
      key={cron.toExpression()}
      cron={cron}
      onSubmit={handleSubmit}
      options={editorOptions}
    />
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

  const showMobileEditorOnly = isMobile && isEditorOpen;

  const renderEditorParamsPanels = () => (
    <>
      <ControlsPanel>
        <Legend>{t.editorParams}</Legend>
        <ParamsHint font="Body/Body 2 Long" color="Neutral/Neutral 50">
          {t.editorParamsHint}
        </ParamsHint>
        <ControlsGrid>
          <ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.scheduleType}
            </T>
            <CheckboxList>
              {scheduleTypeOptions.map((option) => (
                <CheckboxField
                  key={option.value}
                  checked={editorOptions.scheduleTypes.includes(option.value)}
                  onChange={(event) =>
                    patchScheduleTypes(option.value, event.target.checked)
                  }
                >
                  {option.label}
                </CheckboxField>
              ))}
            </CheckboxList>
          </ControlGroup>

          <ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.occursFrequency}
            </T>
            <CheckboxList>
              {occursOptions.map((option) => (
                <CheckboxField
                  key={option.value}
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
            </CheckboxList>
          </ControlGroup>

          <ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.dailyFrequency}
            </T>
            <CheckboxList>
              {dailyFrequencyOptions.map((option) => (
                <CheckboxField
                  key={option.value}
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
            </CheckboxList>
          </ControlGroup>

          <ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.weeklySection}
            </T>
            <CheckboxList>
              <CheckboxField
                checked={editorOptions.weeklyWeekNumbers}
                onChange={(event) =>
                  patchWeeklyWeekNumbers(event.target.checked)
                }
              >
                {t.showMonthWeeks}
              </CheckboxField>
            </CheckboxList>
          </ControlGroup>

          <ControlGroup>
            <SelectField
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
          </ControlGroup>
        </ControlsGrid>
      </ControlsPanel>

      <ControlsPanel>
        <Legend>{t.requiredFields}</Legend>
        <ControlGroup>
          <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
            {t.requiredFieldsHint}
          </T>
          <CheckboxList>
            {requireOptions.map((option) => (
              <CheckboxField
                key={option.value}
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
          </CheckboxList>
        </ControlGroup>
      </ControlsPanel>
    </>
  );

  const renderMobileEditorActions = () => (
    <EditorActions>
      <Button
        appearance="primary"
        dimension="m"
        type="button"
        onClick={handleEditorOk}
      >
        {t.saveSchedule}
      </Button>
      <Button appearance="secondary" dimension="m" onClick={closeEditor}>
        {t.closeEditor}
      </Button>
    </EditorActions>
  );

  return (
    <Page>
      {showMobileEditorOnly ? (
        <MobileEditorOnly>
          {renderCronEditor()}
          {renderMobileEditorActions()}
        </MobileEditorOnly>
      ) : (
        <>
      <T font="Header/H4" as="h3">
        {t.pageTitle}
      </T>
      <PageDescription font="Body/Body 1 Long" color="Neutral/Neutral 50" as="p">
        {t.pageDescription}
      </PageDescription>

      <HorizontalTabs
        selectedTabId={activeTab}
        onSelectTab={(tabId) => selectTab(tabId as PageTabId)}
        tabsId={pageTabs.map((tab) => tab.id)}
        renderTab={renderPageTab}
        tabIsDisabled={() => false}
      />

      {cronParamError && (
        <UrlErrorNotice status="error" displayStatusIcon>
          <NotificationItemTitle>{t.urlError.title}</NotificationItemTitle>
          <NotificationItemContent>
            {cronParamError}. {t.urlError.defaultUsed} (
            {Cron.createEmpty().toExpression()}).
          </NotificationItemContent>
        </UrlErrorNotice>
      )}

      {activeTab === 'constructor' && (
        <TabContent>
          <HelpNotice status="info" displayStatusIcon>
            <NotificationItemTitle>{t.help.title}</NotificationItemTitle>
            <NotificationItemContent>
              <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>{t.help.step1}</li>
                <li>{t.help.step2}</li>
                <li>{t.help.step3}</li>
                <li>{t.help.step4}</li>
              </ol>
            </NotificationItemContent>
          </HelpNotice>

        <CronSummary>
          <CronSummaryFields>
            <CronExpressionField expression={cron.toExpression()} />
            <CronDescriptionField
              description={describeCronHuman(cron, locale)}
            />
          </CronSummaryFields>
          <CronActions>
            <EditScheduleButton
              appearance="primary"
              dimension="m"
              type="button"
              aria-expanded={isEditorOpen}
              onClick={openEditor}
            >
              <ButtonContent>
                <EditOutlined />
                {t.editSchedule}
              </ButtonContent>
            </EditScheduleButton>
          </CronActions>
        </CronSummary>

      {renderEditorParamsPanels()}
        </TabContent>
      )}

      {activeTab === 'checker' && (
        <TabContent>
          <CheckerActions>{renderEditCronButton()}</CheckerActions>
          <CronChecker
            expression={checkerExpression}
            onExpressionChange={changeCheckerExpression}
          />
          <CheckerActions>{renderEditCronButton()}</CheckerActions>
        </TabContent>
      )}

      {!isMobile && isEditorOpen && (
        <Modal
          dimension="xl"
          onClose={closeEditor}
          aria-labelledby="cron-schedule-title"
        >
          <ModalTitle id="cron-schedule-title">{t.editorTitle}</ModalTitle>
          <ModalContent>{renderCronEditor()}</ModalContent>
          <ModalButtonPanel>{renderEditorActions()}</ModalButtonPanel>
        </Modal>
      )}
        </>
      )}

    </Page>
  );
};

export default CronPage;
