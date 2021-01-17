export const validateField = fieldRules => value => {
  const failedRule = fieldRules.find(rule => !rule.test(value))
  return failedRule ? failedRule.error : undefined
}

export const isRequired = x => !!x
export const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/