type ParseError = Error | string | unknown

export function parseJson (input: unknown): [object, ParseError] {
  const text = new String(input)
  let json: object = {}
  let error: ParseError = {}

  try {
    json = JSON.parse(text.toString())
  } catch (err) {
    if (err instanceof Error) error = err
    else if (typeof err === 'string') error = new Error(err)
    else error = err
  }
  
  return [json, error]
}
