export const todayBR = () =>
  new Date().toLocaleDateString('pt-BR')

export const parseDate = (str) => {
  const [d, m, y] = str.split('/')
  return new Date(`${y}-${m}-${d}`)
}
