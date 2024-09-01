exports.pagination = (limit, page = 1, dataArr, propertyName) => {
  let paginatedReturn = [];
  let i = 0;
  const maxIndex =
    page * limit > dataArr.length ? dataArr.length : page * limit;
  if (page) i = page * limit - limit;
  for (; i < maxIndex; i++) {
    paginatedReturn.push(dataArr[i]);
  }
  return {
    [propertyName]: paginatedReturn,
    totalCount: paginatedReturn.length,
  };
};
