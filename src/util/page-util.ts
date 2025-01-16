import {Page} from '@/types/page'

export const PageUtil = {
  toQueryString(page: Page, toUrl: string): string {
    return `${toUrl}?page=${page.page}&size=${page.size}&sort=${page.sort}`;
  },

  createDefaultPage(): Page {
    return {
      page: 0,
      size: 10,
      sort: "",
    }
  },

};
