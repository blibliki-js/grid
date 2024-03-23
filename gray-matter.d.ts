declare module "gray-matter" {
  namespace grayMatter {
    interface GrayMatterFile<T = any> {
      content: string;
      data: {
        [key: string]: any;
      };
      excerpt: string;
      isEmpty: boolean;
      orig: Uint8Array;
    }
  }

  function grayMatter<T = any>(
    str: string,
    options?: {
      excerpt?: boolean | function;
      excerpt_separator?: string;
      engines?: any;
      language?: string;
      delimiters?: string | string[];
    },
  ): grayMatter.GrayMatterFile<T>;

  export = grayMatter;
}
