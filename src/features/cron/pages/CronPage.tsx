import { useEffect, useRef, useState, type FC } from 'react';
import styled from 'styled-components';
import {
  HorizontalTab,
  HorizontalTabs,
  LIGHT_THEME,
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
  PAGE_TABS,
  type PageTabId,
} from '@features/cron/utils/cronPageSearchParams';
import { EditOutlined } from '@ant-design/icons';
import CopyOutline from '@admiral-ds/icons/build/documents/CopyOutline.svg?react';
import packageJson from '../../../../package.json';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';

const Page = styled.main`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px;
  min-width: 0;
  overflow-x: hidden;

  @media (max-width: 767px) {
    padding: 16px 12px;
  }
`;

const CronSummaryCard = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 20px;
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  border-radius: 8px;
  background: ${LIGHT_THEME.color['Neutral/Neutral 05']};

  @media (max-width: 767px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const CronSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

const CronExpressionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const CronExpression = styled.code`
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  padding: 4px 10px;
  border-radius: 4px;
  background: ${LIGHT_THEME.color['Neutral/Neutral 10']};
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  font-family: ui-monospace, 'Cascadia Code', 'SF Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: ${LIGHT_THEME.color['Neutral/Neutral 90']};
  word-break: break-all;
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

const InlineEditorPanel = styled.section`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  border-radius: 8px;
  background: ${LIGHT_THEME.color['Neutral/Neutral 00']};
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 767px) {
    padding: 12px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const InlineEditorTitle = styled(T)`
  display: block;
  margin-bottom: 16px;
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

const CopyButton = styled(Button)`
  flex-shrink: 0;
`;

const ControlsPanel = styled.fieldset`
  border: 1px solid ${LIGHT_THEME.color['Neutral/Neutral 20']};
  border-radius: 4px;
  margin: 24px 0;
  padding: 12px 16px 16px;

  legend {
    padding: 0 6px;
    color: ${LIGHT_THEME.color['Neutral/Neutral 50']};
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

const DAILY_FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Один раз в день' },
  { value: 'every', label: 'Каждые N минут/часов' },
] as const;

const REQUIRE_OPTIONS = [
  { value: 'weeklyWeekDays', label: 'Дни недели обязательны' },
  { value: 'weeklyWeekNumbers', label: 'Недели месяца обязательны' },
] as const satisfies ReadonlyArray<{
  value: CronRequireField;
  label: string;
}>;

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
  const editorPanelRef = useRef<HTMLElement>(null);
  const [editorOptions, setEditorOptions] = useState<Required<CronOptions>>(
    () => ({ ...DEFAULT_CRON_OPTIONS }),
  );

  useEffect(() => {
    if (!isEditorOpen || !isMobile) {
      return;
    }
    editorPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isEditorOpen, isMobile]);

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

  const handleCopyCronExpression = async () => {
    try {
      await navigator.clipboard.writeText(cron.toExpression());
    } catch {
      // Clipboard API недоступен (HTTP, отказ в разрешении) — без уведомления в UI
    }
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
        Сохранить расписание
      </Button>
      <Button appearance="secondary" dimension="m" onClick={closeEditor}>
        Отмена
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
    const tab = PAGE_TABS.find((item) => item.id === tabId);

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
    <Page>
      <T font="Header/H4" as="h3">
        Расписание заданий (v{packageJson.version})
      </T>

      <HorizontalTabs
        selectedTabId={activeTab}
        onSelectTab={(tabId) => selectTab(tabId as PageTabId)}
        tabsId={PAGE_TABS.map((tab) => tab.id)}
        renderTab={renderPageTab}
        tabIsDisabled={() => false}
      />

      {cronParamError && (
        <UrlErrorNotice status="error" displayStatusIcon>
          <NotificationItemTitle>Некорректный cron в адресе</NotificationItemTitle>
          <NotificationItemContent>
            {cronParamError}. Используется расписание по умолчанию (
            {Cron.createEmpty().toExpression()}).
          </NotificationItemContent>
        </UrlErrorNotice>
      )}

      {activeTab === 'constructor' && (
        <TabContent>
          <HelpNotice status="info" displayStatusIcon>
            <NotificationItemTitle>Как пользоваться</NotificationItemTitle>
            <NotificationItemContent>
              <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>
                  Карточка ниже показывает <strong>текущее</strong> расписание. Сама
                  по себе она не меняется.
                </li>
                <li>
                  Чекбоксы «Параметры редактора» настраивают форму — какие поля
                  будут в редакторе.
                </li>
                <li>
                  Нажмите <strong>«Изменить расписание»</strong>, заполните форму и
                  сохраните — карточка обновится.
                </li>
                <li>
                  Чтобы разобрать готовое выражение, перейдите на вкладку{' '}
                  <strong>«Проверка cron»</strong>.
                </li>
              </ol>
            </NotificationItemContent>
          </HelpNotice>

      <CronSummaryCard>
        <CronSummaryContent>
          <T font="Body/Body 1 Long" color="Neutral/Neutral 90">
            {cron.toString({ locale: 'ru' })}
          </T>
          <CronExpressionRow>
            <CronExpression>{cron.toExpression()}</CronExpression>
            <CopyButton
              appearance="ghost"
              dimension="m"
              onClick={handleCopyCronExpression}
              aria-label="Копировать cron-выражение"
              title="Копировать cron-выражение"
            >
              <CopyOutline />
            </CopyButton>
          </CronExpressionRow>
        </CronSummaryContent>
        <CronActions>
          <EditScheduleButton
            appearance="primary"
            dimension="m"
            type="button"
            aria-expanded={isEditorOpen}
            onClick={() => setIsEditorOpen(true)}
          >
            <ButtonContent>
              <EditOutlined />
              {isEditorOpen && isMobile ? 'Редактор открыт ниже' : 'Изменить расписание'}
            </ButtonContent>
          </EditScheduleButton>
        </CronActions>
      </CronSummaryCard>

      {isEditorOpen && isMobile && (
        <InlineEditorPanel ref={editorPanelRef}>
          <InlineEditorTitle font="Header/H6" as="h4">
            Редактор расписания
          </InlineEditorTitle>
          {renderCronEditor()}
          <EditorActions>{renderEditorActions()}</EditorActions>
        </InlineEditorPanel>
      )}

      <ControlsPanel>
        <Legend>Параметры редактора</Legend>
        <ParamsHint font="Body/Body 2 Long" color="Neutral/Neutral 50">
          Влияют только на форму редактора. Чтобы применить расписание, откройте
          «Изменить расписание» и нажмите «Сохранить».
        </ParamsHint>
        <ControlsGrid>
          <ControlGroup>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              Тип расписания
            </T>
            <CheckboxList>
              {SCHEDULE_TYPE_OPTIONS.map((option) => (
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
              Частота (выполняется)
            </T>
            <CheckboxList>
              {OCCURS_OPTIONS.map((option) => (
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
              Ежедневная частота
            </T>
            <CheckboxList>
              {DAILY_FREQUENCY_OPTIONS.map((option) => (
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
              Еженедельно
            </T>
            <CheckboxList>
              <CheckboxField
                checked={editorOptions.weeklyWeekNumbers}
                onChange={(event) =>
                  patchWeeklyWeekNumbers(event.target.checked)
                }
              >
                Показывать недели месяца (1–5)
              </CheckboxField>
            </CheckboxList>
          </ControlGroup>

          <ControlGroup>
            <SelectField
              label="Шаг минут"
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
              Делители 60: TimePicker и интервал «каждые N минут»
            </T>
          </ControlGroup>
        </ControlsGrid>
      </ControlsPanel>

      <ControlsPanel>
        <Legend>Обязательные поля</Legend>
        <ControlGroup>
          <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
            Пустой список — все поля необязательны при сохранении расписания
          </T>
          <CheckboxList>
            {REQUIRE_OPTIONS.map((option) => (
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
        </TabContent>
      )}

      {activeTab === 'checker' && (
        <TabContent>
          <CronChecker
            expression={checkerExpression}
            onExpressionChange={changeCheckerExpression}
          />
        </TabContent>
      )}

      {isEditorOpen && !isMobile && (
        <Modal
          dimension="xl"
          onClose={closeEditor}
          aria-labelledby="cron-schedule-title"
        >
          <ModalTitle id="cron-schedule-title">Редактор расписания</ModalTitle>
          <ModalContent>{renderCronEditor()}</ModalContent>
          <ModalButtonPanel>{renderEditorActions()}</ModalButtonPanel>
        </Modal>
      )}

    </Page>
  );
};

export default CronPage;
