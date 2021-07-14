const filterMap = {
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

function getSqlForKey (k, value) {
  const val = value || filterMap[k].default

  if (val) {
    return filterMap[k].sql.replace('{}', val)
  }

  return undefined
}

function constructFilterSql (filters) {
  const sqlArray = Object.keys(filterMap)
    .map((k) => getSqlForKey(k, filters[k]))
    .filter((v) => v)

  return sqlArray.join('\nAND ')
}

function addFilters (sql, filters) {
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
