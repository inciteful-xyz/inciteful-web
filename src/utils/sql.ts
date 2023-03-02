interface SqlFilter {
  sql: string,
  default?: number | undefined
}

const filterMap: Record<string, SqlFilter> = {
  minYear: {
    sql: 'p.published_year >= {}'
  },
  maxYear: {
    sql: 'p.published_year <= {}'
  },
  minDistance: {
    sql: 'p.distance >= {}',
    default: 1
  },
  maxDistance: {
    sql: 'p.distance <= {}'
  },
  keywords: {
    sql: 'p.paper_id IN (SELECT paper_id FROM title_search(\'{}\'))'
  }
}

function getSqlForKey(k: string, value: string | undefined) {
  const val = value || filterMap[k].default

  if (val != undefined) {
    return filterMap[k].sql.replace('{}', val.toString())
  }

  return undefined
}

function constructFilterSql(filters: Record<string, string | undefined>) {
  const sqlArray = Object.keys(filterMap)
    .map((k) => getSqlForKey(k, filters[k]))
    .filter((v) => v)

  return sqlArray.join('\nAND ')
}

function addFilters(sql: string, filters: Record<string, string | undefined>) {
  while (sql.includes('{{filters}}')) {
    sql = _addFilters(sql, filters)
  }

  return sql
}
function _addFilters(sql: string, filters: Record<string, string | undefined>) {
  if (!sql) {
    return sql
  }

  const pos = sql.indexOf('{{filters}}')

  if (pos === -1) {
    return sql
  }

  const filtSql = constructFilterSql(filters)

  return sql.replace('{{filters}}', filtSql)
}

export default {
  addFilters
}
