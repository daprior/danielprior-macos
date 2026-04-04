import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { noopStorage } from "@/store/noop-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";

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

const initialNotes: Note[] = [
  {
    id: 1,
    title: "About Me",
    content: `# Daniel Prior\nFrontend Developer & Full Stack Engineer\n\n## Skills\n### Frontend\n- React/Next.js\n- Vue.js/Nuxt.js\n- TypeScript/JavaScript\n- Tailwind CSS/SCSS\n- UI/UX Design\n- Responsive Web Development\n- Vite/Webpack\n- Wordpress, Umbraco etc.\n\n### Backend\n- Node.js/Express\n- PHP/Laravel/Slim\n- Python/Django\n- Rust & GO (learning)\n- SQL (MySQL, PostgreSQL)\n- NoSQL (MongoDB)\n- RESTful APIs/GraphQL\n\n### Game Development\n- Unity/Unreal Engine\n- C# & C++\n- Game Design Principles\n- Game Mechanics & Systems\n- Blender 3D/3D Modeling\n- Animations for agricultural machinery and vehicles\n- Godot Engine\n\n### DevOps & Tools\n- Docker/Containerization\n- CI/CD Pipelines\n- Git/GitHub\n- Agile/Scrum Methodologies\n- AWS/Cloud Services\n- Linux/Unix\n\n## Experience\nCurrently working as a Senior Full Stack Developer, focusing on building accessible, performant, and scalable web applications. Experienced in leading development teams and implementing best practices for modern web development.\n\n## Contact\nEmail: mail@danielprior.dk\nGitHub: github.com/daprior\nPortfolio: danielprior.dev`,
    date: "Today, 10:30 AM",
  },
  {
    id: 2,
    title: "Learning Goals",
    content: `# Learning Goals\n\n## Career & Independence\n- Network with like-minded professionals and mentors\n- Build a personal brand and online presence\n- Work on meaningful AI projects with real-world impact\n- Enhance knowledge in industries I'm passionate about (fintech, finance, web3 and automotive)\n\n## Technical Skills\n- Master Rust for performance-critical applications and systems programming\n- Improve Go proficiency for backend services and microservices\n- Deepen knowledge of AI/ML frameworks and practical applications\n- Make popular games with Unity and Unreal Engine\n\n## Personal Projects\n- Develop an indie game from concept to release\n- Build AI-powered tools that enhance creative workflows\n- Create open-source libraries that solve real problems\n- Contribute to projects I use and admire\n\n## Learning Approach\n- Focus on deep understanding rather than surface-level knowledge\n- Build complete projects rather than just tutorials and unfinished projects\n- Share knowledge and experiences with the community\n- Maintain a balance between breadth and depth of skills`,
    date: "Yesterday, 3:15 PM",
  },
];

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
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
