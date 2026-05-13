export function mouseXY2WorldXY(mouseX: number, mouseY: number, world: HTMLDivElement) {
  const xInViewport = mouseX - world.getBoundingClientRect().x
  const yInViewport = mouseY - world.getBoundingClientRect().y
  const xInWorld = xInViewport / (Number(world.style.scale) || 1)
  const yInWorld = yInViewport / (Number(world.style.scale) || 1)
  return { xInWorld, yInWorld }
}
export function grid2world(gridX: number, gridY: number, gridSize: number) {
  return { xInWorld: gridX * gridSize, yInWorld: gridY * gridSize }
}
