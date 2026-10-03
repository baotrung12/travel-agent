import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {TrashIcon} from "@heroicons/react/24/outline";
import MenuBar from "@/app/components/TipTapMenuBar";
import {Field, IconButton, Input} from "@/app/components/admin/ui";

type TourScheduleItem = {
  title: string
  description: string
}

type ScheduleItemProps = {
  item: TourScheduleItem
  index: number
  form: {
    tourSchedule: TourScheduleItem[]
    [key: string]: any // other fields in your form
  }
  setForm: React.Dispatch<React.SetStateAction<any>>
}

export default function ScheduleItem({ item, index, setForm }: ScheduleItemProps) {
  // Functional updates so the editor callback never writes back stale form state
  const updateItem = (patch: Partial<TourScheduleItem>) =>
    setForm((prev: any) => ({
      ...prev,
      tourSchedule: prev.tourSchedule.map((day: TourScheduleItem, i: number) => (i === index ? { ...day, ...patch } : day)),
    }))

  const editor = useEditor({
    extensions: [StarterKit],
    content: item.description || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => updateItem({ description: editor.getHTML() }),
  })

  return (
    <div className="rounded-lg ring-1 ring-gray-200">
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-sm font-semibold text-gray-900">Ngày {index + 1}</span>
        <IconButton
          label="Xoá ngày này"
          tone="danger"
          onClick={() =>
            setForm((prev: any) => ({
              ...prev,
              tourSchedule: prev.tourSchedule.filter((_: TourScheduleItem, i: number) => i !== index),
            }))
          }
        >
          <TrashIcon className="size-5" />
        </IconButton>
      </div>

      <div className="space-y-4 p-4">
        <Field label="Tiêu đề">
          <Input
            type="text"
            placeholder="VD: TP.HCM – Vũng Tàu – Bãi Sau"
            value={item.title}
            onChange={(e) => updateItem({ title: e.target.value })}
          />
        </Field>

        <div>
          <span className="block text-sm/6 font-medium text-gray-900">Hoạt động trong ngày</span>
          <div className="mt-2 rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-600">
            {editor && (
              <div className="border-b border-gray-200 px-2 py-1.5">
                <MenuBar editor={editor} />
              </div>
            )}
            <EditorContent editor={editor} className="min-h-[220px] text-sm text-gray-900 [&_.tiptap]:m-0 [&_.tiptap]:min-h-[200px] [&_.tiptap]:px-3 [&_.tiptap]:py-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
