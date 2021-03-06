// @flow

export function getTwoDigitCode (code: string) {
  const twoDigitCodeRaw = parseInt(code.substring(0, 2), 10)
  let twoDigitCode
  let twoDigitTitle

  // Hard coded right now because I'm too lazy to engineer it
  if (twoDigitCodeRaw >= 92) {
    twoDigitCode = '92'
    twoDigitTitle = 'Public Administration'
  } else if (twoDigitCodeRaw >= 81) {
    twoDigitCode = '81'
    twoDigitTitle = 'Other Services (except Public Administration)'
  } else if (twoDigitCodeRaw >= 72) {
    twoDigitCode = '72'
    twoDigitTitle = 'Accommodation and Food Services'
  } else if (twoDigitCodeRaw >= 71) {
    twoDigitCode = '71'
    twoDigitTitle = 'Arts, Entertainment, and Recreation'
  } else if (twoDigitCodeRaw >= 62) {
    twoDigitCode = '62'
    twoDigitTitle = 'Health Care and Social Assistance'
  } else if (twoDigitCodeRaw >= 61) {
    twoDigitCode = '61'
    twoDigitTitle = 'Educational Services'
  } else if (twoDigitCodeRaw >= 56) {
    twoDigitCode = '56'
    twoDigitTitle = 'Administrative and Support and Waste Management and Remediation Services'
  } else if (twoDigitCodeRaw >= 55) {
    twoDigitCode = '55'
    twoDigitTitle = 'Management of Companies and Enterprises'
  } else if (twoDigitCodeRaw >= 54) {
    twoDigitCode = '54'
    twoDigitTitle = 'Professional, Scientific, and Technical Services'
  } else if (twoDigitCodeRaw >= 53) {
    twoDigitCode = '53'
    twoDigitTitle = 'Real Estate and Rental and Leasing'
  } else if (twoDigitCodeRaw >= 52) {
    twoDigitCode = '52'
    twoDigitTitle = 'Finance and Insurance'
  } else if (twoDigitCodeRaw >= 51) {
    twoDigitCode = '51'
    twoDigitTitle = 'Information'
  } else if (twoDigitCodeRaw >= 48) {
    twoDigitCode = '48-49'
    twoDigitTitle = 'Transportation and Warehousing'
  } else if (twoDigitCodeRaw >= 44) {
    twoDigitCode = '44-45'
    twoDigitTitle = 'Retail Trade'
  } else if (twoDigitCodeRaw >= 42) {
    twoDigitCode = '42'
    twoDigitTitle = 'Wholesale Trade'
  } else if (twoDigitCodeRaw >= 31) {
    twoDigitCode = '31-33'
    twoDigitTitle = 'Manufacturing'
  } else if (twoDigitCodeRaw >= 23) {
    twoDigitCode = '23'
    twoDigitTitle = 'Construction'
  } else if (twoDigitCodeRaw >= 22) {
    twoDigitCode = '22'
    twoDigitTitle = 'Utilities'
  } else if (twoDigitCodeRaw >= 21) {
    twoDigitCode = '21'
    twoDigitTitle = 'Mining, Quarrying, and Oil and Gas Extraction'
  } else if (twoDigitCodeRaw >= 11) {
    twoDigitCode = '11'
    twoDigitTitle = 'Agriculture, Forestry, Fishing and Hunting'
  }

  return {
    code: twoDigitCode,
    title: twoDigitTitle
  }
}

/**
 * Parse crossref text.
 *
 * @param {Array} crossrefs - the original array is parsed and returned.
 * @param {Object} record - the original record object, used for reference only.
 * @returns {Array} crossrefs - the mutated array is returned.
 */
export function parseCrossrefs (crossrefs: Array<Object>, record: Object) {
  if (!crossrefs) {
    return
  }

  for (let i = 0, j = crossrefs.length; i < j; i++) {
    const crossref = crossrefs[i]

    // Replace dashes with em dash. Don't replace with an HTML entity, because
    // React will render it literally.
    crossref.text = crossref.text.replace('--', '—')
  }

  return crossrefs
}
