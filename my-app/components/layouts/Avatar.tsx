import React from 'react'
import { Avatar as PaperAvatar } from 'react-native-paper'

type AvatarProps = {
  uri?: string
  name: string
  size: number
}

// Hàm để sinh ra màu ngẫu nhiên
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const Avatar = ({ uri, name, size }: AvatarProps) => {
  const isNoImage = !uri
  const randomColor = getRandomColor() // Tạo màu ngẫu nhiên cho chữ

  return isNoImage ? (
    <PaperAvatar.Text
      size={size}
      label={name ? name[0].toUpperCase() : 'N'}
      style={{
        backgroundColor: randomColor, // Màu nền ngẫu nhiên cho avatar không có ảnh
      }}
    />
  ) : (
    <PaperAvatar.Image
      size={size}
      source={{ uri }}
      style={{
        backgroundColor: 'transparent', // Không có nền khi có ảnh
      }}
    />
  )
}

export default Avatar
