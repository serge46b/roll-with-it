import { fetchGmNotesByWorld } from "../../api/fetchers"
import AddGmNoteField from "./AddGmNoteField"
import { GmNoteCard } from "./GmNoteCard"

export default async function GmNotesList({ worldUUID }: { worldUUID: string }) {
  const notes = await fetchGmNotesByWorld(worldUUID)

  return (
    <div className="flex w-full flex-col gap-[0.55em]">
      {notes.map((note) => (
        <GmNoteCard key={note.id} data={note} />
      ))}
      <AddGmNoteField />
    </div>
  )
}
