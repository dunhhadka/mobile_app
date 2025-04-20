import { LogResponse } from "../types/management";

export default function calculateWorkedHours(logs: LogResponse[]): string {
  if (!logs || logs.length === 0) return '00:00';

  // Tìm log 'in' đầu tiên
  const logIn = logs.find(log => log.type === 'in');
  if (!logIn) return '00:00';

  const startWork = new Date(logIn.check_in);

  // Xác định thời điểm kết thúc
  const lastLog = logs[logs.length - 1];
  let endTime: Date;

  if (lastLog.type === 'out' || lastLog.type === 'break_work') {
    endTime = new Date(lastLog.check_in);
  } else {
    endTime = new Date(); // Nếu chưa out hoặc break_work → dùng now()
  }

  // Tính tổng thời gian nghỉ từ các cặp break_work → back_work
  let breakTimeInSeconds = 0;
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].type === 'break_work') {
      const breakStart = new Date(logs[i].check_in);
      const backLog = logs.slice(i + 1).find(log => log.type === 'back_work');

      if (backLog) {
        const breakEnd = new Date(backLog.check_in);
        breakTimeInSeconds += (breakEnd.getTime() - breakStart.getTime()) / 1000;
        i = logs.indexOf(backLog); // bỏ qua log back_work đã tính
      }
    }
  }

  // Tính tổng giờ làm thực tế
  const workedSeconds = (endTime.getTime() - startWork.getTime()) / 1000 - breakTimeInSeconds;
  const hours = Math.floor(workedSeconds / 3600);
  const minutes = Math.floor((workedSeconds % 3600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
