import { useMemo, type FC } from 'react';
import styled from 'styled-components';
import {
  NotificationItem,
  NotificationItemContent,
  NotificationItemTitle,
  TextInput,
  T,
} from '@admiral-ds/react-ui';
import { parseCronExpression } from '@features/cron/utils/parseCronExpression';

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
  display: contents;

  @media (max-width: 767px) {
    display: grid;
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
  font-family: ui-monospace, 'Cascadia Code', 'SF Mono', monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.color['Neutral/Neutral 90']};
`;

const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Placeholder = styled(T)`
  margin-top: 12px;
`;

type CronCheckerProps = {
  expression: string;
  onExpressionChange: (value: string) => void;
};

export const CronChecker: FC<CronCheckerProps> = ({
  expression,
  onExpressionChange,
}) => {
  const parseResult = useMemo(
    () => (expression.trim() ? parseCronExpression(expression) : null),
    [expression],
  );

  return (
    <Panel>
      <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
        Вставьте пятичастное выражение: минута час день_месяца месяц день_недели
      </T>

      <InputWrap>
        <TextInput
          value={expression}
          onChange={(event) => onExpressionChange(event.currentTarget.value)}
          placeholder="0 9 * * 1"
          style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'SF Mono', monospace" }}
        />
      </InputWrap>

      {!parseResult && (
        <Placeholder font="Body/Body 2 Long" color="Neutral/Neutral 50">
          Например: <code>0 9 * * 1</code> — по понедельникам в 09:00
        </Placeholder>
      )}

      {parseResult && !parseResult.valid && (
        <Breakdown>
          <NotificationItem status="error" displayStatusIcon>
            <NotificationItemTitle>Ошибка разбора</NotificationItemTitle>
            <NotificationItemContent>{parseResult.error}</NotificationItemContent>
          </NotificationItem>
        </Breakdown>
      )}

      {parseResult?.valid && (
        <Breakdown>
          <PartsTable>
            <PartHeaderRow>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                Поле
              </PartHeader>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                Значение
              </PartHeader>
              <PartHeader font="Body/Body 2 Short" color="Neutral/Neutral 50">
                Расшифровка
              </PartHeader>
            </PartHeaderRow>

            {parseResult.parts.map((part) => (
              <PartRow key={part.key}>
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

          {/*
            cronstrue — прямой перевод строки; редактор — после fromCron/toCron (как в модалке).
          */}
          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              Чем отличаются
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50" as="div">
              Оба поля ниже — человекочитаемый текст одного и того же cron, но полученный разными
              способами.
              <br />
              <br />
              <strong>Описание (cronstrue)</strong> — библиотека cronstrue читает cron-строку
              напрямую. Это полный смысл выражения «как в спецификации cron».
              <br />
              <br />
              <strong>Расписание (редактор)</strong> — тот же текст, что в модалке «Изменить
              расписание». Сначала cron раскладывается на поля формы (ежедневно / по понедельникам /
              15-е число, время…), потом снова собирается в cron и описывается.
              <br />
              <br />
              Когда совпадают: простые расписания, которые форма умеет — например{' '}
              <code>0 9 * * *</code> → оба «В 09:00».
              <br />
              <br />
              Когда расходятся:
              <br />
              — однократный запуск <code>30 14 25 3 *</code>: cronstrue — «В 14:30, 25-го марта»;
              редактор — «Выполняется один раз 25.03.2026 в 14:30» (добавляет текущий год);
              <br />
              — сложный cron (несколько дней, списки, нестандартные интервалы): cronstrue опишет
              всё, редактор упростит до ближайшего поддерживаемого варианта формы.
            </T>
          </DescriptionBlock>

          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              Описание (cronstrue)
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
              Прямой перевод cron-строки
            </T>
            <T font="Body/Body 1 Long" color="Neutral/Neutral 90">
              {parseResult.cronDescription}
            </T>
          </DescriptionBlock>

          <DescriptionBlock>
            <T font="Body/Body 2 Short" color="Neutral/Neutral 50">
              Расписание (редактор)
            </T>
            <T font="Body/Body 2 Long" color="Neutral/Neutral 50">
              Как в модалке редактора (через поля формы)
            </T>
            <T font="Body/Body 1 Long" color="Neutral/Neutral 90">
              {parseResult.scheduleDescription}
            </T>
          </DescriptionBlock>

          {parseResult.oneTimeNotice && (
            <NotificationItem status="warning" displayStatusIcon>
              <NotificationItemTitle>Год не входит в cron</NotificationItemTitle>
              <NotificationItemContent>{parseResult.oneTimeNotice}</NotificationItemContent>
            </NotificationItem>
          )}
        </Breakdown>
      )}
    </Panel>
  );
};

export default CronChecker;
