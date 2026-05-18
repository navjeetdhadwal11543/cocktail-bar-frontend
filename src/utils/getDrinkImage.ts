// src/utils/getDrinkImage.ts
export const getDrinkImage = (drinkName: string) => {
  const fileName = `${drinkName.toLowerCase().replace(/\s+/g, '')  }.jpeg`
  return `/Images/${fileName}` // points to public/Images/
}
