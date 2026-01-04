type Ioptions = {
  page?: number | string;
  limit?: number | string;
  sortOrder?: string;
  sortBy?: string;
}
const paginationSortingHelper = (options: Ioptions) => {
  return options;
}

export default paginationSortingHelper;