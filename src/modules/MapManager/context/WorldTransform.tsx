import { createContext } from "react"

export interface WorldTransformContextInterface {
  window2WorldTransform: (x: number, y: number) => { xInWorld: number; yInWorld: number }
  alignToGrid: (x: number, y: number) => { xInWorld: number; yInWorld: number }
  addEventListenerOnContainer: (event: string, handler: (e: MouseEvent) => void) => void
  removeEventListenerOnContainer: (event: string, handler: (e: MouseEvent) => void) => void
}

export const WorldTransformContext = createContext<WorldTransformContextInterface>({
  window2WorldTransform: () => ({ xInWorld: 0, yInWorld: 0 }),
  alignToGrid: () => ({ xInWorld: 0, yInWorld: 0 }),
  addEventListenerOnContainer: () => {},
  removeEventListenerOnContainer: () => {},
})
