"use client"
import { FileUploadField } from "@/components/FileUploadField"
import { MapEditModalContext } from "./MapEditModalContext"
import { useContext, useTransition } from "react"
import { prepareImage } from "../../helpers/PrepareImage"

export default function AddMapField() {
  const { openModal } = useContext(MapEditModalContext)
  const [isFilePending, startFilePendingTransition] = useTransition()
  return (
    <div className="relative">
      {isFilePending && <div className="absolute top-0 left-0 h-full w-full animate-pulse bg-white/50"></div>}
      <FileUploadField
        onFileSet={(file) => {
          if (!file) return
          startFilePendingTransition(async () => {
            const preparedImage = await prepareImage(file)
            await openModal({ image: preparedImage })
          })
        }}
        accept="image/*"
        placeholder=""
        inline
      />
    </div>
  )
}
