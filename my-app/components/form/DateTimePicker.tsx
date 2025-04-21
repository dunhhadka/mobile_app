import { Platform, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface Props {
  value: Date | string | undefined
  onClose: () => void
  onChange: (date: Date) => void
}

const CustomDateTimePicker = ({ value, onClose, onChange }: Props) => {
  const dateValue =
    value instanceof Date ? value : new Date(value || new Date())

  return (
    <View>
      <DateTimePicker
        value={dateValue}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          onClose()

          if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
            onChange(selectedDate)
          } else {
            console.error('Invalid date selected.')
          }
        }}
      />
    </View>
  )
}

export default CustomDateTimePicker
