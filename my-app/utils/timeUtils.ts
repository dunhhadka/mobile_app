import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi' // nếu muốn hiển thị tiếng Việt

dayjs.extend(relativeTime)
dayjs.locale('vi') // chọn tiếng Việt (nếu cần)

export const getTimeAgo = (time: string) => {
  return dayjs(time).fromNow()
}
