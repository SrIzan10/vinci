export async function decompressRecipes(file: ICFile) {
    const recipes = file.recipes;
    const items = file.items;
    return recipes.map((recipe) => ({
      first: items[recipe[0]]!,
      second: items[recipe[1]]!,
      result: items[recipe[2]]!,
    })) as Recipe[];
}

export interface Recipe {
    first: string;
    second: string;
    result: string;
}

export interface ICFile {
    recipes: number[][];
    items: string[];
}