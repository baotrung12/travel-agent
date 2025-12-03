import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from "@/app/components/TipTapMenuBar";

type TourScheduleItem = {
  date: string
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

export default function ScheduleItem({ item, index, form, setForm }: ScheduleItemProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: item.description || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const updated = [...form.tourSchedule]
      updated[index].description = editor.getHTML()
      setForm({ ...form, tourSchedule: updated })
    },
  })

  return (
    <div className="bg-white border rounded-lg p-4 space-y-2 mt-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-blue-600">Ngày {index + 1}</span>
        <button
          type="button"
          onClick={() => {
            const updated = [...form.tourSchedule]
            updated.splice(index, 1)
            setForm({ ...form, tourSchedule: updated })
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm"
        >
          Xoá
        </button>
      </div>

      <input
        type="date"
        value={item.date}
        onChange={(e) => {
          const updated = [...form.tourSchedule]
          updated[index].date = e.target.value
          setForm({ ...form, tourSchedule: updated })
        }}
        className="border rounded-md p-2 text-sm w-40"
      />

      <input
        type="text"
        placeholder="Tiêu đề ngắn"
        value={item.title}
        onChange={(e) => {
          const updated = [...form.tourSchedule]
          updated[index].title = e.target.value
          setForm({ ...form, tourSchedule: updated })
        }}
        className="w-full border rounded-md p-2 text-sm"
      />

      <label>Mô tả hoạt động trong ngày</label>
      <div className="border rounded p-2 min-h-[300px]">
        {editor && <MenuBar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
