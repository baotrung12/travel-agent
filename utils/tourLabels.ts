import {Category} from "@/app/generated/prisma/enums";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.STUDENT]: "Trải nghiệm học sinh",
  [Category.TEACHER]: "Tham quan giáo viên",
  [Category.SHORT_TRIP]: "Du lịch ngắn ngày",
  [Category.LONG_TRIP]: "Du lịch dài ngày",
  [Category.SPECIAL]: "Tour đặc biệt",
};
