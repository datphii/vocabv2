import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id.trim().toLowerCase() }),
      clearUserId: () => set({ userId: null }),
    }),
    { name: "mechwords-user" }
  )
);
