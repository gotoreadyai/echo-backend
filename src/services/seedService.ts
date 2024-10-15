import fs from "fs/promises";
import path from "path";

/**
 * Zapisuje dane w formacie JSON do pliku na serwerze. Jeśli content jest przekazany, pobiera dane z pliku w katalogu seedSlug.
 * @param {string} directory - Ścieżka katalogu, w którym plik zostanie zapisany.
 * @param {string} name - Nazwa pliku (bez rozszerzenia).
 * @param {Object} data - Obiekt danych, które mają zostać zapisane w formacie JSON.
 * @param {string} [plugin] - Opcjonalna nazwa pluginu do pobrania contentu z pliku.
 * @param {boolean} [useContent] - Jeśli true, dane zostaną pobrane z pliku seedSlug/_init.json.
 * @returns {Promise<string>} - Obietnica zwracająca ścieżkę do utworzonego pliku.
 * @throws {Error} - Błąd, jeśli brakuje nazwy pliku, danych lub zapis się nie powiedzie.
 */
export async function saveJsonToFile(
  directory: string,
  name: string,
  data: object,
  plugin?: string,
  useContent: boolean = false
): Promise<string> {
  if (!name) {
    throw new Error("Brakuje nazwy pliku.");
  }

  let finalData = data;

  // Jeśli useContent jest true, pobierz dane z pliku _init.json
  if (useContent && plugin) {
    const contentPath = path.join("src", "plugins", plugin, "seedSlug", "_init.json");
    try {
      const content = await fs.readFile(contentPath, "utf8");
      finalData = JSON.parse(content);
    } catch (error) {
      console.error(`Błąd podczas pobierania contentu z ${contentPath}:`, error);
      throw new Error("Nie udało się pobrać contentu z pliku.");
    }
  }

  // Zabezpieczenie nazwy pliku przed atakami path traversal
  const safeName = path.basename(name);

  // Ścieżka do zapisu pliku
  const filePath = path.join(directory, `${safeName}.json`);

  try {
    // Upewnij się, że katalog istnieje
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Zapisz dane do pliku w formacie JSON
    await fs.writeFile(filePath, JSON.stringify(finalData, null, 2), "utf8");

    return filePath;
  } catch (error) {
    console.error("Błąd podczas zapisywania pliku:", error);
    throw new Error("Nie udało się zapisać pliku.");
  }
}
