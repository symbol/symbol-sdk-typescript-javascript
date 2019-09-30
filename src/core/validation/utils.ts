// @TODO: move from here when doing vee-validate implementation

/**
 * Returns boolean if string is likely to be an address.
 * @param string
 * @returns boolean
 */
export const isAddress = (str: string): boolean => {
      return str
            .trim()
            .toUpperCase()
            .replace(/-/g, '')
            .length === 40
}
