#!/usr/bin/env python3
"""
Script para extraer datos de la Tabla de Valores Imponibles del ISCV e IVA
por Enajenación de Vehículos Terrestres 2026 y convertirlos a CSV.
"""

import pdfplumber
import csv
import re
from pathlib import Path


# Encabezado fijo basado en la estructura del documento
COLUMN_HEADERS = [
    "MARCA",
    "LINEA", 
    "TIPO_VEHICULO",
    "CILINDRAJE",
    "POTENCIA",
    "TONELAJE",
    "CARROCERIA",
    "COMBUSTIBLE",
    "TRANSMISION",
    "EJES",
    "TRACCION",
    "PUERTAS",
    "PASAJEROS",
    "CODIGO",
    "VALOR_VEHICULO",
    "ISCV_2026_2%",
    "ISCV_2025_1.8%",
    "ISCV_2024_1.6%",
    "ISCV_2023_1.4%",
    "ISCV_2022_1.2%",
    "ISCV_2021_1.0%",
    "ISCV_2020_0.8%",
    "ISCV_2019_0.6%",
    "ISCV_2018_0.4%",
    "ISCV_2017_0.2%"
]


def clean_text(text):
    """Limpia el texto de espacios extra y caracteres especiales."""
    if text is None:
        return ""
    # Convertir a string
    text = str(text).strip()
    # Eliminar espacios múltiples
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def clean_currency(text):
    """
    Limpia valores monetarios eliminando espacios incorrectos.
    Ej: "Q 1 50.00" -> "Q 150.00", "Q 1 ,629.60" -> "Q 1,629.60"
    """
    if not text:
        return text
    
    text = str(text).strip()
    
    # Si empieza con Q, limpiar espacios en el número
    if text.startswith('Q'):
        # Remover la Q y espacios iniciales
        number_part = text[1:].strip()
        
        # Patrón para detectar espacios incorrectos en números
        # "1 50.00" -> "150.00", "1 ,629.60" -> "1,629.60"
        # Eliminar espacios antes de comas o puntos
        number_part = re.sub(r'\s+,', ',', number_part)
        number_part = re.sub(r'\s+\.', '.', number_part)
        
        # Eliminar espacios entre dígitos (ej: "1 50" -> "150", "3 04,252" -> "304,252")
        # Pero mantener comas como separadores de miles
        number_part = re.sub(r'(\d)\s+(\d)', r'\1\2', number_part)
        
        text = f"Q {number_part}"
    
    return text


def is_title_or_header_row(row):
    """
    Detecta si una fila es un título del documento o encabezado de tabla.
    """
    if not row:
        return False
    
    row_text = ' '.join([clean_text(cell) for cell in row if cell]).upper()
    
    # Detectar título principal del documento
    if 'TABLA DE VALORES IMPONIBLES' in row_text:
        return True
    
    # Detectar fila de años (2026, 2025, 2024...)
    year_pattern = r'\b20[12]\d\b'
    years_found = re.findall(year_pattern, row_text)
    if len(years_found) >= 3:
        return True
    
    # Detectar fila de porcentajes
    if re.search(r'\d+\.?\d*%', row_text) and row_text.count('%') >= 3:
        return True
    
    return False


def is_valid_data_row(row):
    """
    Verifica si una fila contiene datos válidos de vehículos.
    """
    if not row:
        return False
    
    # Limpiar celdas
    cleaned_cells = [clean_text(cell) for cell in row]
    
    # Contar celdas no vacías
    non_empty_cells = [cell for cell in cleaned_cells if cell]
    
    # Una fila válida debe tener al menos 5 celdas con contenido
    if len(non_empty_cells) < 5:
        return False
    
    # La primera celda debe parecer una marca (texto alfabético)
    first_cell = cleaned_cells[0] if cleaned_cells else ""
    if not first_cell or not re.search(r'[A-Za-z]', first_cell):
        return False
    
    # Debe contener al menos un valor monetario (Q seguido de número)
    row_text = ' '.join(cleaned_cells)
    if not re.search(r'Q\s*[\d,]+', row_text):
        return False
    
    return True


def extract_tables_from_pdf(pdf_path):
    """
    Extrae todas las tablas del PDF.
    """
    all_rows = []
    
    print(f"Abriendo PDF: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total de páginas: {total_pages}")
        
        for page_num, page in enumerate(pdf.pages, 1):
            print(f"Procesando página {page_num}/{total_pages}...", end=" ")
            page_rows = 0
            
            # Extraer tablas de la página con configuración optimizada
            tables = page.extract_tables({
                "vertical_strategy": "lines",
                "horizontal_strategy": "lines",
                "snap_tolerance": 3,
                "join_tolerance": 3,
                "edge_min_length": 3,
                "min_words_vertical": 1,
                "min_words_horizontal": 1,
            })
            
            if not tables:
                # Intentar con estrategia alternativa
                tables = page.extract_tables({
                    "vertical_strategy": "text",
                    "horizontal_strategy": "text",
                    "snap_tolerance": 5,
                    "join_tolerance": 5,
                })
            
            for table in tables:
                for row in table:
                    if not row:
                        continue
                    
                    # Limpiar cada celda de la fila
                    cleaned_row = [clean_text(cell) for cell in row]
                    
                    # Saltar títulos y encabezados
                    if is_title_or_header_row(cleaned_row):
                        continue
                    
                    # Verificar si es una fila de datos válida
                    if is_valid_data_row(cleaned_row):
                        # Limpiar valores monetarios
                        for i, cell in enumerate(cleaned_row):
                            if cell.startswith('Q') or 'Q ' in cell:
                                cleaned_row[i] = clean_currency(cell)
                        
                        all_rows.append(cleaned_row)
                        page_rows += 1
            
            print(f"({page_rows} filas)")
    
    return all_rows


def normalize_rows(rows, expected_cols=25):
    """
    Normaliza las filas para que todas tengan el mismo número de columnas.
    """
    normalized_rows = []
    
    for row in rows:
        if len(row) < expected_cols:
            # Agregar celdas vacías si faltan columnas
            row = row + [''] * (expected_cols - len(row))
        elif len(row) > expected_cols:
            # Recortar si hay columnas extra
            row = row[:expected_cols]
        
        normalized_rows.append(row)
    
    return normalized_rows


def save_to_csv(header, rows, output_path):
    """
    Guarda los datos en un archivo CSV.
    """
    print(f"\nGuardando {len(rows)} filas en: {output_path}")
    
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Escribir encabezado
        writer.writerow(header)
        
        # Escribir datos
        for row in rows:
            writer.writerow(row)
    
    print(f"Archivo CSV guardado exitosamente!")


def main():
    # Obtener la ruta del directorio actual del script
    script_dir = Path(__file__).parent
    
    # Buscar el archivo PDF
    pdf_filename = "Tabla-de-Valores-Imponibles-del-ISCV-e-IVA-por-Enajenacion-de-Vehiculos-Terrestres-2026.pdf"
    pdf_path = script_dir / pdf_filename
    
    if not pdf_path.exists():
        print(f"Error: No se encontró el archivo PDF: {pdf_path}")
        return
    
    # Definir ruta de salida
    output_filename = "valores_imponibles_vehiculos_2026.csv"
    output_path = script_dir / output_filename
    
    # Extraer datos del PDF
    rows = extract_tables_from_pdf(pdf_path)
    
    if not rows:
        print("Error: No se encontraron datos en el PDF.")
        return
    
    print(f"\nTotal de filas extraídas: {len(rows)}")
    
    # Normalizar filas
    normalized_rows = normalize_rows(rows, len(COLUMN_HEADERS))
    
    # Guardar a CSV
    save_to_csv(COLUMN_HEADERS, normalized_rows, output_path)
    
    # Mostrar estadísticas y ejemplos
    print(f"\n--- Estadísticas ---")
    print(f"Filas de datos: {len(normalized_rows)}")
    print(f"Columnas: {len(COLUMN_HEADERS)}")
    print(f"\nPrimeras 3 filas de ejemplo:")
    for i, row in enumerate(normalized_rows[:3], 1):
        print(f"  {i}. {row[0]} | {row[1]} | {row[2]} | Valor: {row[14]}")


if __name__ == "__main__":
    main()
