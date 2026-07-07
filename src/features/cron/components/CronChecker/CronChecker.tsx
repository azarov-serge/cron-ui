import React from 'react';
import styled from 'styled-components';
import {
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
  TextInput,
  T,
} from '@admiral-ds/react-ui';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';
import { useTranslation } from '@shared/i18n/useTranslation';
import { formatMessage } from '@shared/i18n/messages';
import { MONO_FONT_FAMILY } from '@shared/styles/typography';

const Panel = styled.section`
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
  border-radius: 8px;
  background: ${({ theme }) => theme.color['Neutral/Neutral 05']};

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const InputWrap = styled.div`
  margin-top: 12px;
`;

const Breakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

const PartsTable = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(100px, 0.8fr) minmax(160px, 1.2fr);
  gap: 8px 12px;
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color['Neutral/Neutral 00']};
  border: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const PartRow = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: 8px 12px;
  align-items: start;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 4px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

const PartHeaderRow = styled.div`
  display: contents;

  @media (max-width: 767px) {
    display: none;
  }
`;

const PartHeader = styled(T)`
  padding-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.color['Neutral/Neutral 20']};
`;

const PartValue = styled.code`
  font-family: ${MONO_FONT_FAMILY};
  font-size: 13px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
`;

const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CronInput = styled(TextInput)`
  input {
    font-family: ${MONO_FONT_FAMILY};
    font-size: 14px;
    line-height: 20px;
  }
`;

const DescriptionText = styled(T)`
  word-break: break-word;
`;

const Placeholder = styled(T)`
  margin-top: 12px;
`;

type CronCheckerProps = {
  expression: string;
  onExpressionChange: (value: string) => void;
};

export const CronChecker: React.FC<CronCheckerProps> = (props) => {
  const { expression, onExpressionChange } = props;
  const { t, locale } = useTranslation();
  const [draftExpression, setDraftExpression] = React.useState(expression);

  React.useEffect(() => {
    setDraftExpression(expression);
  }, [expression]);

  const parseResult = React.useMemo(
    () =>
      draftExpression.trim()
        ? parseCronExpression(draftExpression, locale)
        : null,
    [draftExpression, locale],
  );

  const handleExpressionChange = (value: string) => {
    setDraftExpression(value);
    onExpressionChange(value);
  };

  return (
    <Panel>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
        {t.checker.hint}
      </T>

      <InputWrap>
        <CronInput
          dimension="s"
          value={draftExpression}
          onChange={(event) => handleExpressionChange(event.target.value)}
          onInput={(event) =>
            handleExpressionChange(event.currentTarget.value)
          }
          placeholder="0 9 * * 1"
        />
      </InputWrap>

      {!parseResult && (
        <Placeholder font="Body/Body 2 Long" color="Neutral/Neutral 50">
          {t.checker.placeholderExample}
        </Placeholder>
      )}

      {parseResult !== null && parseResult.valid === false && (
        <Breakdown>
          <NotificationItem status="error" displayStatusIcon>
            <NotificationItemTitle>{t.checker.parseError}</NotificationItemTitle>
            <NotificationItemContent>{parseResult.error}</NotificationItemContent>
          </NotificationItem>
        </Breakdown>
      )}

      {parseResult?.valid === true && (
        <Breakdown key={parseResult.expression}>
          <PartsTable>
            <PartHeaderRow>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                {t.checker.field}
              </PartHeader>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                {t.checker.value}
              </PartHeader>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                {t.checker.meaning}
              </PartHeader>
            </PartHeaderRow>

            {parseResult.parts.map((part) => (
              <PartRow key={`${parseResult.expression}-${part.key}`}>
                <T font="Body/Body 2 Long" color="Neutral/Neutral 90">
                  {part.label}
                </T>
                <PartValue>{part.value}</PartValue>
                <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
                  {part.hint}
                </T>
              </PartRow>
            ))}
          </PartsTable>

          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.checker.diffTitle}
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50" as="div">
              {t.checker.diffIntro}
              <br />
              <br />
              <strong>{t.checker.cronstrueSectionTitle}</strong> —{' '}
              {t.checker.diffCronstrueText}
              <br />
              <br />
              <strong>{t.checker.editorSectionTitle}</strong> —{' '}
              {formatMessage(t.checker.diffEditorText, {
                editAction: t.editSchedule,
              })}
              <br />
              <br />
              {t.checker.diffWhenMatch}
              <br />
              <br />
              {t.checker.diffWhenDiverge}
              <br />
              — {t.checker.diffDivergeOneTime}
              <br />
              — {t.checker.diffDivergeComplex}
            </T>
          </DescriptionBlock>

          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.checker.cronstrueSectionTitle}
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
              {t.checker.cronstrueSectionHint}
            </T>
            <DescriptionText font="Body/Body 1 Long" color="Neutral/Neutral 90">
              {parseResult.cronDescription}
            </DescriptionText>
          </DescriptionBlock>

          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              {t.checker.editorSectionTitle}
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
              {t.checker.editorSectionHint}
            </T>
            <DescriptionText font="Body/Body 1 Long" color="Neutral/Neutral 90">
              {parseResult.scheduleDescription}
            </DescriptionText>
          </DescriptionBlock>

          {parseResult.oneTimeNotice && (
            <NotificationItem status="warning" displayStatusIcon>
              <NotificationItemTitle>
                {t.editor.yearNotInCronTitle}
              </NotificationItemTitle>
              <NotificationItemContent>{parseResult.oneTimeNotice}</NotificationItemContent>
            </NotificationItem>
          )}
        </Breakdown>
      )}
    </Panel>
  );
};

export default CronChecker;
