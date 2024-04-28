export function buildRoutePath(path) {
  const routeParamsPath = /:([a-zA-z]+)/g
  const pathWithParams = path.replace(routeParamsPath, '(?<$1>[a-z0-9\-_]+)')

  const regexPath = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return regexPath
}