export const formatThegraphIdToDate = (id: number): string => {
  const date = new Date(id * 86400 * 1000)

  return `${date.getDate()}/${date.getMonth() + 1}`
}
