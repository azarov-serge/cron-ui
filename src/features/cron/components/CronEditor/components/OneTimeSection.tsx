import {
  DateField,
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
} from '@admiral-ds/react-ui';
import { TimePickerField } from '@shared/components/TimePicker';
import { getOneTimeYearNotice } from '@shared/i18n/messages';
import { useTranslation } from '@shared/i18n/useTranslation';
import {
  DateFieldWrap,
  InlineRow,
  NoticeWrap,
  Section,
  TimeFieldWrap,
} from '../styles';
import { Legend } from './Legend';
import { useCronEditorStore } from '../hooks/useCronEditorStore';

export const OneTimeSection = () => {
  const { t } = useTranslation();
  const scheduleType = useCronEditorStore((state) => state.schedule.scheduleType);
  const oneTimeDate = useCronEditorStore((state) => state.schedule.oneTimeDate);
  const oneTimeTime = useCronEditorStore((state) => state.schedule.oneTimeTime);
  const minuteStep = useCronEditorStore((state) => state.options.minuteStep);
  const patchSchedule = useCronEditorStore((state) => state.patchSchedule);
  const patchTime = useCronEditorStore((state) => state.patchTime);

  if (scheduleType !== 'one-time') {
    return null;
  }

  return (
    <Section>
      <Legend>{t.editor.oneTimeSection}</Legend>
      <InlineRow>
        <DateFieldWrap>
          <DateField
            dimension="s"
            label={t.editor.date}
            value={oneTimeDate}
            onChange={(event) =>
              patchSchedule({ oneTimeDate: event.target.value })
            }
          />
        </DateFieldWrap>
        <TimeFieldWrap>
          <TimePickerField
            label={t.editor.time}
            value={oneTimeTime}
            minuteStep={minuteStep}
            onChange={(time) => patchTime('oneTimeTime', time)}
          />
        </TimeFieldWrap>
      </InlineRow>
      <NoticeWrap>
        <NotificationItem status="warning" displayStatusIcon>
          <NotificationItemTitle>{t.editor.yearNotInCronTitle}</NotificationItemTitle>
          <NotificationItemContent>
            {getOneTimeYearNotice(oneTimeDate, t)}
          </NotificationItemContent>
        </NotificationItem>
      </NoticeWrap>
    </Section>
  );
};
