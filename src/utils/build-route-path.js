// /user/:id

export function buildRoutePath(path) {
  const routeParamsRegex = /:([a-zA-Z]+)/g
  const pathWtihParams = path.replaceAll(routeParamsRegex, '(?<$1>[a-z0-9-_]+)')

  const pathRegex = new RegExp(`^${pathWtihParams}(?<query>\\?(.*))?$`)

  return pathRegex
}
