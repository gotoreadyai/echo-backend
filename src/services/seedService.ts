import fs from "fs/promises";
import path from "path";

/**
 * Zapisuje dane JSON do pliku na serwerze.
 * @param {string} directory - Katalog, w którym ma zostać zapisany plik.
 * @param {string} name - Nazwa pliku bez rozszerzenia.
 * @param {Object} data - Dane do zapisania w formacie JSON.
 * @returns {Promise<string>} Ścieżka do utworzonego pliku.
 */
export async function saveJsonToFile(directory: string, name: string, data: object): Promise<string> {
  if (!name || !data) {
    throw new Error("Brakuje nazwy pliku lub danych.");
  }

  // Zabezpieczenie nazwy pliku przed atakami path traversal
  const safeName = path.basename(name);

  // Ścieżka do zapisu pliku
  const filePath = path.join(directory, `${safeName}.json`);

  try {
    // Upewnij się, że katalog istnieje
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Zapisz dane do pliku w formacie JSON
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    return filePath;
  } catch (error) {
    console.error("Błąd podczas zapisywania pliku:", error);
    throw new Error("Nie udało się zapisać pliku.");
  }
}
