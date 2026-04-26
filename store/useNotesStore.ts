import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { noopStorage } from "@/store/noop-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { initialNotes as INITIAL_NOTES } from "@/constants/initial-notes";
import { createSelectors } from "./createSelectors";

export type Note = {
  id: number;
  title: string;
  content: string;
  date: string;
};

type NotesState = {
  notes: Note[];
  selectedNoteId: number;
};

type NotesActions = {
  selectNote: (id: number) => void;
  updateSelectedNoteContent: (content: string) => void;
};

export type NotesStore = NotesState & NotesActions;

const NOTES_PERSIST_VERSION = 3;

const initialNotesForStore = INITIAL_NOTES as Note[];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: initialNotesForStore,
      selectedNoteId: 1,

      selectNote: (id) => set({ selectedNoteId: id }),

      updateSelectedNoteContent: (content) => {
        const { notes, selectedNoteId } = get();
        set({
          notes: notes.map((note) =>
            note.id === selectedNoteId ? { ...note, content } : note,
          ),
        });
      },
    }),
    {
      name: STORAGE_KEYS.notesState,
      version: NOTES_PERSIST_VERSION,
      migrate: () => ({
        notes: initialNotesForStore,
        selectedNoteId: 1,
      }),
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        notes: state.notes,
        selectedNoteId: state.selectedNoteId,
      }),
    },
  ),
);

export const useNotesStoreSelectors = createSelectors(useNotesStore);
