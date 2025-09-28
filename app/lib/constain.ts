import type { NavigationMenuItem } from '@nuxt/ui'

// * NAVIGATION MENU ITEMS

// Giới hạn số lượng mục hiển thị ban đầu
export const LIMIT_MENU_ITEMS = 8

const baseCategories = [
  { label: 'Thế giới', slug: 'the-gioi' },
  { label: 'Kinh doanh', slug: 'kinh-doanh' },
  { label: 'Xe', slug: 'xe' },
  { label: 'Văn hóa', slug: 'van-hoa' },
  { label: 'Thể thao', slug: 'the-thao' },
  { label: 'Khoa học', slug: 'khoa-hoc' },
  { label: 'Giả thật', slug: 'gia-that' },
  { label: 'Bạn đọc', slug: 'ban-doc' },
  { label: 'Thời sự', slug: 'thoi-su' },
  { label: 'Pháp luật', slug: 'phap-luat' },
  { label: 'Công nghệ', slug: 'cong-nghe' },
  { label: 'Nhịp sống trẻ', slug: 'nhip-song-tre' },
  { label: 'Giải trí', slug: 'giai-tri' },
  { label: 'Giáo dục', slug: 'giao-duc' },
  { label: 'Sức khỏe', slug: 'suc-khoe' },
  { label: 'Thư giãn', slug: 'thu-gian' },
  { label: 'Du lịch', slug: 'du-lich' },
]

export const navigationLinks: NavigationMenuItem[] = [
  {
    label: 'Trang chủ',
    icon: 'i-heroicons-home',
    to: '/',
  },
  ...baseCategories.map((cat) => ({
    label: cat.label,
    to: `/${cat.slug}`,
  })),
]
