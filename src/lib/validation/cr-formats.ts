/**
 * Costa Rican Format Validators
 * 
 * Validates identification numbers, phone numbers, and vehicle plates
 * according to Costa Rican standards.
 * 
 * All validators return true if valid, false otherwise.
 */

/**
 * Validate Cédula Física (Personal ID)
 * Format: #-####-####
 * Example: 1-1234-5678
 * 
 * @param cedula - Cédula number with or without formatting
 * @returns true if valid
 */
export function isValidCedulaFisica(cedula: string): boolean {
  // Remove formatting
  const cleaned = cedula.replace(/[-\s]/g, '')

  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return false
  }

  // First digit must be 1-9 (not 0)
  if (cleaned[0] === '0') {
    return false
  }

  return true
}

/**
 * Validate Cédula Jurídica (Business ID)
 * Format: #-###-######
 * Example: 3-101-123456
 * 
 * @param cedula - Cédula number with or without formatting
 * @returns true if valid
 */
export function isValidCedulaJuridica(cedula: string): boolean {
  // Remove formatting
  const cleaned = cedula.replace(/[-\s]/g, '')

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return false
  }

  // First digit must be 1-9 (not 0)
  if (cleaned[0] === '0') {
    return false
  }

  return true
}

/**
 * Validate DIMEX (Foreigner ID)
 * Format: ############ (11-12 digits)
 * 
 * @param dimex - DIMEX number
 * @returns true if valid
 */
export function isValidDIMEX(dimex: string): boolean {
  // Remove formatting
  const cleaned = dimex.replace(/[-\s]/g, '')

  // Must be 11-12 digits
  if (!/^\d{11,12}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate NITE (Temporary ID)
 * Format: ########## (10 digits)
 * 
 * @param nite - NITE number
 * @returns true if valid
 */
export function isValidNITE(nite: string): boolean {
  // Remove formatting
  const cleaned = nite.replace(/[-\s]/g, '')

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate Pasaporte (Passport)
 * Format: Alphanumeric 6-20 characters
 * 
 * @param pasaporte - Passport number
 * @returns true if valid
 */
export function isValidPasaporte(pasaporte: string): boolean {
  // Remove whitespace
  const cleaned = pasaporte.trim()

  // Must be 6-20 alphanumeric characters
  if (!/^[A-Z0-9]{6,20}$/i.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate identification number by type
 * 
 * @param tipo - Type of identification (fisica, juridica, dimex, nite, pasaporte)
 * @param numero - Identification number
 * @returns true if valid for the given type
 */
export function isValidIdentification(
  tipo: 'fisica' | 'juridica' | 'dimex' | 'nite' | 'pasaporte',
  numero: string
): boolean {
  switch (tipo) {
    case 'fisica':
      return isValidCedulaFisica(numero)
    case 'juridica':
      return isValidCedulaJuridica(numero)
    case 'dimex':
      return isValidDIMEX(numero)
    case 'nite':
      return isValidNITE(numero)
    case 'pasaporte':
      return isValidPasaporte(numero)
    default:
      return false
  }
}

/**
 * Validate Costa Rican phone number
 * Format: +506 ####-#### or 506 #### #### or ########
 * 
 * @param phone - Phone number
 * @returns true if valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove formatting
  const cleaned = phone.replace(/[-\s+]/g, '')

  // Remove country code if present
  let digits = cleaned
  if (digits.startsWith('506')) {
    digits = digits.substring(3)
  }

  // Must be exactly 8 digits
  if (!/^\d{8}$/.test(digits)) {
    return false
  }

  // First digit must be 2-8 (valid area codes)
  const firstDigit = parseInt(digits[0])
  if (firstDigit < 2 || firstDigit > 8) {
    return false
  }

  return true
}

/**
 * Validate vehicle plate - Particular format
 * Format: ABC-123 (3 letters, 3 numbers)
 * 
 * @param plate - Vehicle plate
 * @returns true if valid
 */
export function isValidPlateParticular(plate: string): boolean {
  // Remove formatting
  const cleaned = plate.replace(/[-\s]/g, '').toUpperCase()

  // Must be 6 characters: 3 letters + 3 numbers
  if (!/^[A-Z]{3}\d{3}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate vehicle plate - Taxi format
 * Format: TX-1234 (TX + 4 numbers)
 * 
 * @param plate - Vehicle plate
 * @returns true if valid
 */
export function isValidPlateTaxi(plate: string): boolean {
  // Remove formatting
  const cleaned = plate.replace(/[-\s]/g, '').toUpperCase()

  // Must be 6 characters: TX + 4 numbers
  if (!/^TX\d{4}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate vehicle plate - Motorcycle format
 * Format: A-12345 (1 letter + 5 numbers)
 * 
 * @param plate - Vehicle plate
 * @returns true if valid
 */
export function isValidPlateMotorcycle(plate: string): boolean {
  // Remove formatting
  const cleaned = plate.replace(/[-\s]/g, '').toUpperCase()

  // Must be 6 characters: 1 letter + 5 numbers
  if (!/^[A-Z]\d{5}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Validate vehicle plate - any format
 * Accepts: ABC-123, TX-1234, A-12345
 * 
 * @param plate - Vehicle plate
 * @returns true if valid in any format
 */
export function isValidPlate(plate: string): boolean {
  return (
    isValidPlateParticular(plate) ||
    isValidPlateTaxi(plate) ||
    isValidPlateMotorcycle(plate)
  )
}

/**
 * Validate CABYS code (13 digits)
 * CABYS = Clasificación de Actividades Económicas
 * 
 * @param cabys - CABYS code
 * @returns true if valid
 */
export function isValidCABYS(cabys: string): boolean {
  // Remove formatting
  const cleaned = cabys.replace(/[-\s]/g, '')

  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(cleaned)) {
    return false
  }

  return true
}

/**
 * Format phone number to standard format
 * Input: 87654321, +506 8765 4321, 506-8765-4321
 * Output: +506 8765-4321
 * 
 * @param phone - Phone number
 * @returns Formatted phone number or empty string if invalid
 */
export function formatPhoneNumber(phone: string): string {
  if (!isValidPhoneNumber(phone)) {
    return ''
  }

  // Remove formatting
  const cleaned = phone.replace(/[-\s+]/g, '')

  // Remove country code if present
  let digits = cleaned
  if (digits.startsWith('506')) {
    digits = digits.substring(3)
  }

  // Format as +506 ####-####
  return `+506 ${digits.substring(0, 4)}-${digits.substring(4)}`
}

/**
 * Format cédula física to standard format
 * Input: 112345678, 1-1234-5678
 * Output: 1-1234-5678
 * 
 * @param cedula - Cédula number
 * @returns Formatted cédula or empty string if invalid
 */
export function formatCedulaFisica(cedula: string): string {
  if (!isValidCedulaFisica(cedula)) {
    return ''
  }

  const cleaned = cedula.replace(/[-\s]/g, '')
  return `${cleaned[0]}-${cleaned.substring(1, 5)}-${cleaned.substring(5)}`
}

/**
 * Format cédula jurídica to standard format
 * Input: 3101123456, 3-101-123456
 * Output: 3-101-123456
 * 
 * @param cedula - Cédula number
 * @returns Formatted cédula or empty string if invalid
 */
export function formatCedulaJuridica(cedula: string): string {
  if (!isValidCedulaJuridica(cedula)) {
    return ''
  }

  const cleaned = cedula.replace(/[-\s]/g, '')
  return `${cleaned[0]}-${cleaned.substring(1, 4)}-${cleaned.substring(4)}`
}

/**
 * Format vehicle plate to standard format
 * Input: ABC123, abc-123, TX1234, A12345
 * Output: ABC-123, TX-1234, A-12345
 * 
 * @param plate - Vehicle plate
 * @returns Formatted plate or empty string if invalid
 */
export function formatPlate(plate: string): string {
  if (!isValidPlate(plate)) {
    return ''
  }

  const cleaned = plate.replace(/[-\s]/g, '').toUpperCase()

  if (isValidPlateParticular(cleaned)) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`
  }

  if (isValidPlateTaxi(cleaned)) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`
  }

  if (isValidPlateMotorcycle(cleaned)) {
    return `${cleaned[0]}-${cleaned.substring(1)}`
  }

  return ''
}
