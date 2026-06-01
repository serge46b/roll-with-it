export interface PreparedImage {
  image: HTMLImageElement
  imageFile: File
  width: number
  height: number
}
export async function prepareImage(imagefile: File) {
  const image = new Image()
  image.src = URL.createObjectURL(imagefile)
  await image.decode()
  return {
    image,
    imageFile: imagefile,
    width: image.width,
    height: image.height,
  }
}
